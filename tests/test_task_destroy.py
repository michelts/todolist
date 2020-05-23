import pytest

from app import models


@pytest.fixture
def get_response(source, client, user, task):
    if source == "web":

        def wrapper():
            with client.session_transaction() as session:
                session["_user_id"] = user.id
                session["_fresh"] = True
            return client.delete(f"/api/v1/tasks/{task.id}/")

    elif source == "api":

        def wrapper():
            return client.delete(f"/api/v1/tasks/{task.id}/?api_key={user.username}")

    else:
        raise ValueError(f"Unknown source {source}")
    return wrapper


def test_task_destroy_returns_403_for_unauthenticated_user(client, task):
    response = client.delete(f"/api/v1/tasks/{task.id}/")
    assert response.status_code == 401


@pytest.mark.parametrize("source", ["web", "api"])
def test_task_destroy_turns_task_is_removed_flag_on(user, task, get_response):
    response = get_response()
    assert response.status_code == 204

    obj = models.Task.query.one()
    assert obj.is_removed is True
