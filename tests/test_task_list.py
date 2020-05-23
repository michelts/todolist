from datetime import date
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


def test_task_list_returns_task_objects_sorted_by_date_by_default(
    session, user_client, user
):
    today = date(2020, 5, 23)
    task1 = models.Task(description="Task 1", user_id=user.id, due_date=today)
    session.add(task1)
    yesterday = date(2020, 5, 22)
    task2 = models.Task(description="Task 1", user_id=user.id, due_date=yesterday)
    session.add(task2)
    session.commit()

    response = user_client.get("/api/v1/tasks/")
    assert response.status_code == 200
    assert response.json == [task2.serialize(), task1.serialize()]


def test_task_list_returns_task_objects_without_date_first(session, user_client, user):
    task1 = models.Task(description="Task 1", user_id=user.id, due_date=None)
    session.add(task1)
    yesterday = date(2020, 5, 22)
    task2 = models.Task(description="Task 1", user_id=user.id, due_date=yesterday)
    session.add(task2)
    session.commit()

    response = user_client.get("/api/v1/tasks/")
    assert response.status_code == 200
    assert response.json == [task1.serialize(), task2.serialize()]


def test_task_list_returns_task_objects_sorted_by_priority(session, user_client, user):
    today = date(2020, 5, 23)
    task1 = models.Task(
        description="Task 1", user_id=user.id, due_date=today, priority=1
    )
    session.add(task1)
    yesterday = date(2020, 5, 22)
    task2 = models.Task(
        description="Task 1", user_id=user.id, due_date=yesterday, priority=0
    )
    session.add(task2)
    session.commit()

    response = user_client.get("/api/v1/tasks/?sort=priority")
    assert response.status_code == 200
    assert response.json == [task1.serialize(), task2.serialize()]
