import pytest
import datetime

from todolist import models


@pytest.fixture
def task(session, **extra_create_kwargs):
    create_kwargs = {
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
            "due_date": task.due_date,
        }
    ]
