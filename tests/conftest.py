import datetime
import os

import pytest

from app import create_app, db as _db, models

TEST_DATABASE_PATH = "/tmp/test.db"
TEST_DATABASE_URI = "sqlite:///%s" % TEST_DATABASE_PATH


@pytest.fixture
def app(request):
    app = create_app(DATABASE_URI=TEST_DATABASE_URI, DEBUG=True)

    ctx = app.app_context()
    ctx.push()

    def teardown():
        ctx.pop()

    request.addfinalizer(teardown)
    return app


@pytest.fixture
def db(request, app):
    if os.path.exists(TEST_DATABASE_PATH):
        os.unlink(TEST_DATABASE_PATH)

    def teardown():
        _db.drop_all()
        os.unlink(TEST_DATABASE_PATH)

    _db.app = app
    _db.create_all()

    request.addfinalizer(teardown)
    return _db


@pytest.fixture(scope="function")
def session(request, db):
    connection = db.engine.connect()
    transaction = connection.begin()

    options = dict(bind=connection, binds={})
    session = db.create_scoped_session(options=options)

    db.session = session

    def teardown():
        transaction.rollback()
        connection.close()
        session.remove()

    request.addfinalizer(teardown)
    return session


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
