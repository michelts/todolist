import os
import pytest
from todolist import create_app, db as _db

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
