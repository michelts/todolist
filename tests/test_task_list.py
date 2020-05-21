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
