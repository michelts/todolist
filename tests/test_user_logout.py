def test_user_logout_clear_authentication(
    user_client
):
    response = user_client.get("/api/v1/users/logout/")
    assert response.status_code == 204

    with user_client.session_transaction() as session:
        assert '_fresh' not in session
        assert '_user_id' not in session


def test_user_logout_ignore_already_logged_out_user(client):
    response = client.get("/api/v1/users/logout/")
    assert response.status_code == 204

    with client.session_transaction() as session:
        assert '_fresh' not in session
        assert '_user_id' not in session
