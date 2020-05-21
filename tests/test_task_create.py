import pytest
from datetime import datetime

from app import models


@pytest.fixture
def payload():
    return {"description": "Say hello!"}


def test_task_create_returns_403_for_unauthenticated_user(client, payload):
    response = client.post("/api/v1/tasks/", json=payload)
    assert response.status_code == 401


def test_task_create_task_and_return_it_for_authenticated_user(
    user_client, user, payload
):
    response = user_client.post("/api/v1/tasks/", json=payload)
    assert response.status_code == 201

    obj = models.Task.query.one()
    assert obj.user_id == user.id
    assert obj.description == payload["description"]
    assert obj.priority == 0  # default value when suppressed
    assert obj.due_date is None
    assert obj.completed is False  # default value when suppressed

    assert response.json == {
        "id": obj.id,
        "description": obj.description,
        "priority": obj.priority,
        "due_date": None,
        "completed": obj.completed,
    }


def test_task_creation_fails_when_description_is_missing(
    user_client, user, payload
):
    del payload['description']
    response = user_client.post("/api/v1/tasks/", json=payload)
    assert response.status_code == 400


@pytest.mark.parametrize('invalid_value', ['some-invalid-value', '', None])
def test_task_creation_fails_when_due_date_is_invalid(
    user_client, user, payload, invalid_value
):
    payload['due_date'] = invalid_value
    response = user_client.post("/api/v1/tasks/", json=payload)
    assert response.status_code == 400
