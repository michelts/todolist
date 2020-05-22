def test_user_login_authenticates_user_if_credentials_match(
    client, user, generic_password
):
    payload = {"username": user.username, "password": generic_password}
    response = client.post("/api/v1/users/login/", json=payload)
    assert response.status_code == 200
    assert response.json == {
        "id": user.id,
        "username": user.username,
        "name": user.name,
    }

    with client.session_transaction() as session:
        assert session['_fresh'] is True
        assert session['_user_id'] == str(user.id)


def test_user_login_returns_400_error_if_password_mismatch(client, user):
    payload = {"username": user.username, "password": "wrong-password"}
    response = client.post("/api/v1/users/login/", json=payload)
    assert response.status_code == 401
    assert response.json == {"non_field_errors": ["Authentication failed"]}

    with client.session_transaction() as session:
        assert '_fresh' not in session
        assert '_user_id' not in session


def test_user_login_returns_400_error_if_username_is_not_found(
    client, user, generic_password
):
    payload = {"username": "missing_user", "password": generic_password}
    response = client.post("/api/v1/users/login/", json=payload)
    assert response.status_code == 401
    assert response.json == {"non_field_errors": ["Authentication failed"]}

    with client.session_transaction() as session:
        assert '_fresh' not in session
        assert '_user_id' not in session


def test_user_login_returns_400_error_if_username_is_missing(
    client, user, generic_password
):
    payload = {"password": generic_password}
    response = client.post("/api/v1/users/login/", json=payload)
    assert response.status_code == 401
    assert response.json == {"username": ["Missing data for required field."]}

    with client.session_transaction() as session:
        assert '_fresh' not in session
        assert '_user_id' not in session


def test_user_login_returns_400_error_if_password_is_missing(
    client, user, generic_password
):
    payload = {"username": user.username}
    response = client.post("/api/v1/users/login/", json=payload)
    assert response.status_code == 401
    assert response.json == {"password": ["Missing data for required field."]}

    with client.session_transaction() as session:
        assert '_fresh' not in session
        assert '_user_id' not in session
