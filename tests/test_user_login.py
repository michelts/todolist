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


def test_user_login_returns_400_error_if_password_mismatch(client, user):
    payload = {"username": user.username, "password": "wrong-password"}
    response = client.post("/api/v1/users/login/", json=payload)
    assert response.status_code == 401
    assert response.json == {"non_field_errors": ["Authentication failed"]}


def test_user_login_returns_400_error_if_username_is_not_found(
    client, user, generic_password
):
    payload = {"username": "missing_user", "password": generic_password}
    response = client.post("/api/v1/users/login/", json=payload)
    assert response.status_code == 401
    assert response.json == {"non_field_errors": ["Authentication failed"]}


def test_user_login_returns_400_error_if_username_is_missing(
    client, user, generic_password
):
    payload = {"password": generic_password}
    response = client.post("/api/v1/users/login/", json=payload)
    assert response.status_code == 401
    assert response.json == {"username": ["Missing data for required field."]}


def test_user_login_returns_400_error_if_password_is_missing(
    client, user, generic_password
):
    payload = {"username": user.username}
    response = client.post("/api/v1/users/login/", json=payload)
    assert response.status_code == 401
    assert response.json == {"password": ["Missing data for required field."]}
