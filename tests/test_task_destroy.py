from app import models


def test_task_destroy_returns_403_for_unauthenticated_user(client, task):
    response = client.delete(f"/api/v1/tasks/{task.id}/")
    assert response.status_code == 401


def test_task_destroy_turns_task_is_removed_flag_on(
    user_client, user, task
):
    response = user_client.delete(f"/api/v1/tasks/{task.id}/")
    assert response.status_code == 204

    obj = models.Task.query.one()
    assert obj.is_removed is True
