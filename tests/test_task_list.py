import pytest
import datetime

from todolist import models


@pytest.fixture
def user(session):
    user = models.User(username='user', name='John Smith')
    user.password = '123456'
    session.add(user)
    session.commit()
    return user


@pytest.fixture
def task(session, user, **extra_create_kwargs):
    create_kwargs = {
        'user_id': user.id,
        'description': 'Some task',
        'due_date': datetime.date(2020, 5, 21),
    }
    create_kwargs.update(extra_create_kwargs)
    obj = models.Task(**create_kwargs)
    session.add(obj)
    session.commit()
    return obj


def test_task_list_returns_task_objects(client, task):
    response = client.get("/api/v1/tasks/")
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
