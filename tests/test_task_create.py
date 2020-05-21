import pytest
from datetime import datetime

from app import models


@pytest.fixture
def payload():
    return {
        "description": "Say hello!",
        "due_date": "2020-05-21",
    }


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
    assert obj.due_date == datetime.strptime(payload["due_date"], "%Y-%m-%d").date()
    assert obj.completed is False  # default value when suppressed

    assert response.json == {
        "id": obj.id,
        "description": obj.description,
        "priority": obj.priority,
        "due_date": obj.due_date.isoformat(),
        "completed": obj.completed,
    }


@pytest.mark.parametrize("field", ["description", "due_date"])
def test_task_creation_fails_when_description_or_due_date_are_missing(
    user_client, user, payload, field
):
    del payload[field]
    response = user_client.post("/api/v1/tasks/", json=payload)
    assert response.status_code == 400
