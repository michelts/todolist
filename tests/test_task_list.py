from app import models


def test_task_list_returns_403_for_unauthenticated_user(client, user, task):
    response = client.get("/api/v1/tasks/")
    assert response.status_code == 401


def test_task_list_returns_task_objects_for_authenticated_user(user_client, user, task):
    response = user_client.get("/api/v1/tasks/")
    assert response.status_code == 200
    assert response.json == [
        {
            "id": task.id,
            "description": task.description,
            "priority": task.priority,
            "due_date": task.due_date.isoformat(),
            "is_completed": task.is_completed,
        }
    ]


def test_task_list_suppress_removed_tasks(session, user_client, user, task):
    task.is_removed = True
    session.add(task)
    session.commit()

    response = user_client.get("/api/v1/tasks/")
    assert response.status_code == 200
    assert response.json == []


def test_task_list_suppress_tasks_from_other_users(session, user_client, user):
    user = models.User(username="foo", name="Bar")
    session.add(user)
    session.commit()

    task = models.Task(description="Task from other user", user_id=user.id)
    session.add(task)
    session.commit()

    response = user_client.get("/api/v1/tasks/")
    assert response.status_code == 200
    assert response.json == []
