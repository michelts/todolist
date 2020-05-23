from datetime import date

import pytest

from app import models


@pytest.fixture
def get_response(source, client, user):
    if source == "web":

        def wrapper(payload):
            with client.session_transaction() as session:
                session["_user_id"] = user.id
                session["_fresh"] = True
            return client.post("/api/v1/tasks/", json=payload)

    elif source == "api":

        def wrapper(payload):
            return client.post(f"/api/v1/tasks/?api_key={user.username}", json=payload)

    else:
        raise ValueError(f"Unknown source {source}")
    return wrapper


@pytest.fixture
def payload():
    return {"description": "Say hello!"}


def test_task_create_returns_403_for_unauthenticated_user(client, payload):
    response = client.post("/api/v1/tasks/", json=payload)
    assert response.status_code == 401


@pytest.mark.parametrize("source", ["web", "api"])
def test_task_create_saves_and_returns_it_for_authenticated_user(
    user, payload, source, get_response
):
    response = get_response(payload)
    assert response.status_code == 201

    obj = models.Task.query.one()
    assert obj.user_id == user.id
    assert obj.description == payload["description"]
    assert obj.priority == 0  # default value when suppressed
    assert obj.due_date is None
    assert obj.is_completed is False  # default value when suppressed

    assert response.json == {
        "id": obj.id,
        "description": obj.description,
        "priority": obj.priority,
        "due_date": None,
        "is_completed": obj.is_completed,
    }


@pytest.mark.parametrize("source", ["web", "api"])
def test_task_create_saves_priority_due_date_and_is_completed_flag_when_available(
    user, payload, get_response
):
    payload["priority"] = 4
    payload["due_date"] = date(2020, 5, 22).isoformat()
    payload["is_completed"] = True
    response = get_response(payload)
    assert response.status_code == 201

    obj = models.Task.query.one()
    assert obj.priority == payload["priority"]
    assert obj.due_date.isoformat() == payload["due_date"]
    assert obj.is_completed == payload["is_completed"]

    assert response.json == {
        "id": obj.id,
        "description": obj.description,
        "priority": obj.priority,
        "due_date": obj.due_date.isoformat(),
        "is_completed": obj.is_completed,
    }


@pytest.mark.parametrize("source", ["web", "api"])
def test_task_update_saves_null_due_date(user, payload, get_response):
    payload["due_date"] = None
    response = get_response(payload)
    assert response.status_code == 201

    obj = models.Task.query.one()
    assert obj.due_date is None


@pytest.mark.parametrize("source", ["web", "api"])
def test_task_creation_fails_when_description_is_missing(user, payload, get_response):
    del payload["description"]
    response = get_response(payload)
    assert response.status_code == 400
    assert response.json == {"description": ["Missing data for required field."]}


@pytest.mark.parametrize("source", ["web", "api"])
@pytest.mark.parametrize("invalid_value", ["some-invalid-value", ""])
def test_task_creation_fails_when_due_date_is_invalid(
    user, payload, invalid_value, get_response
):
    payload["due_date"] = invalid_value
    response = get_response(payload)
    assert response.status_code == 400
    assert response.json == {"due_date": ["Not a valid date."]}


@pytest.mark.parametrize("source", ["web", "api"])
@pytest.mark.parametrize("invalid_value", ["some-invalid-value", ""])
def test_task_creation_fails_when_priority_is_not_integer(
    user, payload, invalid_value, get_response
):
    payload["priority"] = invalid_value
    response = get_response(payload)
    assert response.status_code == 400
    assert response.json == {"priority": ["Not a valid integer."]}


@pytest.mark.parametrize("source", ["web", "api"])
def test_task_creation_fails_when_priority_is_null(user, payload, get_response):
    payload["priority"] = None
    response = get_response(payload)
    assert response.status_code == 400
    assert response.json == {"priority": ["Field may not be null."]}


@pytest.mark.parametrize("source", ["web", "api"])
@pytest.mark.parametrize("invalid_value", ["some-invalid-value", ""])
def test_task_creation_fails_when_is_completed_flag_is_not_boolean(
    user, payload, invalid_value, get_response
):
    payload["is_completed"] = invalid_value
    response = get_response(payload)
    assert response.status_code == 400
    assert response.json == {"is_completed": ["Not a valid boolean."]}


@pytest.mark.parametrize("source", ["web", "api"])
def test_task_creation_fails_when_is_completed_flag_is_null(user, payload, get_response):
    payload["is_completed"] = None
    response = get_response(payload)
    assert response.status_code == 400
    assert response.json == {"is_completed": ["Field may not be null."]}
