def test_current_user_retrieve_return_200_with_authenticated_user_detail(
    user_client, user
):
    response = user_client.get("/api/v1/users/current/")
    assert response.status_code == 200
    assert response.json == {
        "id": user.id,
        "username": user.username,
        "name": user.name,
    }


def test_current_user_retrieve_return_404_for_unauthenticated_user(client, task):
    response = client.get("/api/v1/users/current/")
    assert response.status_code == 404
