import pytest

from app import models


@pytest.fixture
def payload():
    return {"username": "john", "name": "John Smith", "password": "test"}


def test_user_create_saves_user_and_returns_it_already_authenticated(
    session, client, payload
):
    response = client.post("/api/v1/users/", json=payload)
    assert response.status_code == 201

    query = models.User.query.filter(models.User.username == payload["username"])
    obj = query.one()

    assert obj.name == payload["name"]
    assert obj.verify_password(payload["password"]) is True

    assert response.json == {
        "id": obj.id,
        "username": obj.username,
        "name": obj.name,
    }

    with client.session_transaction() as session:
        assert session["_fresh"] is True
        assert session["_user_id"] == str(obj.id)


@pytest.mark.parametrize("field", ["username", "name", "password"])
def test_user_create_fail_for_any_missing_field(session, client, payload, field):
    del payload[field]
    response = client.post("/api/v1/users/", json=payload)
    assert response.status_code == 400
    assert response.json == {field: ["Missing data for required field."]}
