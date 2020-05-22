import pytest
from datetime import timedelta

from app import models


@pytest.fixture
def payload(task):
    due_date = task.due_date + timedelta(days=1)
    return {
        "description": f"Updated {task.description}",
        "priority": task.priority + 1,
        "due_date": due_date.isoformat(),
        "is_completed": not task.is_completed,
    }


def test_task_update_returns_403_for_unauthenticated_user(client, task, payload):
    response = client.put(f"/api/v1/tasks/{task.id}/", json=payload)
    assert response.status_code == 401


def test_task_update_saves_and_returns_it_for_authenticated_user(
    user_client, user, task, payload
):
    response = user_client.put(f"/api/v1/tasks/{task.id}/", json=payload)
    assert response.status_code == 200

    obj = models.Task.query.one()
    assert obj.user_id == user.id
    assert obj.description == payload["description"]
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


@pytest.mark.parametrize(
    "field", ["description", "priority", "due_date", "is_completed"]
)
def test_task_update_fails_when_any_field_is_missing(
    user_client, user, task, payload, field
):
    del payload[field]
    response = user_client.put(f"/api/v1/tasks/{task.id}/", json=payload)
    assert response.status_code == 400
    assert response.json == {field: ["Missing data for required field."]}


def test_task_update_saves_null_due_date(user_client, user, task, payload):
    payload["due_date"] = None
    response = user_client.put(f"/api/v1/tasks/{task.id}/", json=payload)
    assert response.status_code == 200

    obj = models.Task.query.one()
    assert obj.due_date is None


@pytest.mark.parametrize("invalid_value", ["some-invalid-value", ""])
def test_task_update_fails_when_due_date_is_invalid(
    user_client, user, task, payload, invalid_value
):
    payload["due_date"] = invalid_value
    response = user_client.put(f"/api/v1/tasks/{task.id}/", json=payload)
    assert response.status_code == 400
    assert response.json == {"due_date": ["Not a valid date."]}


@pytest.mark.parametrize("invalid_value", ["some-invalid-value", ""])
def test_task_creation_fails_when_priority_is_not_integer(
    user_client, user, task, payload, invalid_value
):
    payload["priority"] = invalid_value
    response = user_client.put(f"/api/v1/tasks/{task.id}/", json=payload)
    assert response.status_code == 400
    assert response.json == {"priority": ["Not a valid integer."]}


def test_task_creation_fails_when_priority_is_null(user_client, user, task, payload):
    payload["priority"] = None
    response = user_client.put(f"/api/v1/tasks/{task.id}/", json=payload)
    assert response.status_code == 400
    assert response.json == {"priority": ["Field may not be null."]}


@pytest.mark.parametrize("invalid_value", ["some-invalid-value", ""])
def test_task_creation_fails_when_is_completed_flag_is_not_boolean(
    user_client, user, task, payload, invalid_value
):
    payload["is_completed"] = invalid_value
    response = user_client.put(f"/api/v1/tasks/{task.id}/", json=payload)
    assert response.status_code == 400
    assert response.json == {"is_completed": ["Not a valid boolean."]}


def test_task_creation_fails_when_is_completed_flag_is_null(
    user_client, user, task, payload
):
    payload["is_completed"] = None
    response = user_client.put(f"/api/v1/tasks/{task.id}/", json=payload)
    assert response.status_code == 400
    assert response.json == {"is_completed": ["Field may not be null."]}
