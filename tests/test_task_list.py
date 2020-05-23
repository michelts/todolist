import pytest
from datetime import date
from app import models


@pytest.fixture
def get_response(source, client, user):
    if source == "web":

        def wrapper():
            with client.session_transaction() as session:
                session["_user_id"] = user.id
                session["_fresh"] = True
            return client.get("/api/v1/tasks/")

    elif source == "api":

        def wrapper():
            return client.get(f"/api/v1/tasks/?api_key={user.username}")

    else:
        raise ValueError(f"Unknown source {source}")
    return wrapper


def test_task_list_returns_403_for_unauthenticated_user(client, user, task):
    response = client.get("/api/v1/tasks/")
    assert response.status_code == 401


@pytest.mark.parametrize("source", ["web", "api"])
def test_task_list_returns_task_objects_for_authenticated_user(task, get_response):
    response = get_response()
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


@pytest.mark.parametrize("source", ["web", "api"])
def test_task_list_suppress_removed_tasks(session, task, get_response):
    task.is_removed = True
    session.add(task)
    session.commit()

    response = get_response()
    assert response.status_code == 200
    assert response.json == []


@pytest.mark.parametrize("source", ["web", "api"])
def test_task_list_suppress_tasks_from_other_users(session, user, get_response):
    other_user = models.User(username="foo", name="Bar")
    session.add(other_user)
    session.commit()

    task = models.Task(description="Task from other user", user_id=other_user.id)
    session.add(task)
    session.commit()

    response = get_response()
    assert response.status_code == 200
    assert response.json == []


@pytest.mark.parametrize("source", ["web", "api"])
def test_task_list_returns_task_objects_sorted_by_date_by_default(
    session, user, get_response
):
    today = date(2020, 5, 23)
    task1 = models.Task(description="Task 1", user_id=user.id, due_date=today)
    session.add(task1)
    yesterday = date(2020, 5, 22)
    task2 = models.Task(description="Task 1", user_id=user.id, due_date=yesterday)
    session.add(task2)
    session.commit()

    response = get_response()
    assert response.status_code == 200
    assert response.json == [task2.serialize(), task1.serialize()]


@pytest.mark.parametrize("source", ["web", "api"])
def test_task_list_returns_task_objects_without_date_first(session, user, get_response):
    task1 = models.Task(description="Task 1", user_id=user.id, due_date=None)
    session.add(task1)
    yesterday = date(2020, 5, 22)
    task2 = models.Task(description="Task 1", user_id=user.id, due_date=yesterday)
    session.add(task2)
    session.commit()

    response = get_response()
    assert response.status_code == 200
    assert response.json == [task1.serialize(), task2.serialize()]


@pytest.mark.parametrize("source", ["web", "api"])
def test_task_list_returns_task_objects_sorted_by_priority(session, user, get_response):
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

    response = get_response()
    assert response.status_code == 200
    assert response.json == [task1.serialize(), task2.serialize()]
