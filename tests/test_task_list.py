import pytest
import datetime
import flask_login

from app import models


@pytest.fixture
def user(session):
    user = models.User(username="user", name="John Smith")
    user.password = "123456"
    session.add(user)
    session.commit()
    return user


@pytest.fixture
def task(session, user, **extra_create_kwargs):
    create_kwargs = {
        "user_id": user.id,
        "description": "Some task",
        "due_date": datetime.date(2020, 5, 21),
    }
    create_kwargs.update(extra_create_kwargs)
    obj = models.Task(**create_kwargs)
    session.add(obj)
    session.commit()
    return obj


@pytest.fixture
def user_client(client, user):
    with client.session_transaction() as session:
        session["_user_id"] = user.id
        session["_fresh"] = True
    return client


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
            "completed": task.completed,
        }
    ]
