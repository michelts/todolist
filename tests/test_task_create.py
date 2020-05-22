import pytest
from datetime import date

from app import models


@pytest.fixture
def payload():
    return {"description": "Say hello!"}


def test_task_create_returns_403_for_unauthenticated_user(client, payload):
    response = client.post("/api/v1/tasks/", json=payload)
    assert response.status_code == 401


def test_task_create_saves_and_returns_it_for_authenticated_user(
    user_client, user, payload
):
    response = user_client.post("/api/v1/tasks/", json=payload)
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


def test_task_create_saves_priority_due_date_and_is_completed_flag_when_available(
    user_client, user, payload
):
    payload["priority"] = 4
    payload["due_date"] = date(2020, 5, 22).isoformat()
    payload["is_completed"] = True
    response = user_client.post("/api/v1/tasks/", json=payload)
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


def test_task_update_saves_null_due_date(user_client, user, payload):
    payload["due_date"] = None
    response = user_client.post("/api/v1/tasks/", json=payload)
    assert response.status_code == 201

    obj = models.Task.query.one()
    assert obj.due_date is None


def test_task_creation_fails_when_description_is_missing(user_client, user, payload):
    del payload["description"]
    response = user_client.post("/api/v1/tasks/", json=payload)
    assert response.status_code == 400


@pytest.mark.parametrize("invalid_value", ["some-invalid-value", ""])
def test_task_creation_fails_when_due_date_is_invalid(
    user_client, user, payload, invalid_value
):
    payload["due_date"] = invalid_value
    response = user_client.post("/api/v1/tasks/", json=payload)
    assert response.status_code == 400
