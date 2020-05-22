from flask import Flask
from flask_migrate import Migrate

from .models import db, login_manager
from .views import tasks_blueprint, users_blueprint


def create_app(DATABASE_URI="sqlite:////tmp/database.db", DEBUG=True):

    app = Flask(__name__)
    app.config["DEBUG"] = DEBUG
    app.config["SECRET_KEY"] = "some-secret-key"
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    Migrate(app, db)
    db.init_app(app)

    login_manager.init_app(app)

    app.register_blueprint(tasks_blueprint, url_prefix="/api/v1/tasks/")
    app.register_blueprint(users_blueprint, url_prefix="/api/v1/users/")
    return app


if __name__ == "__main__":
    app = create_app()
    app.run()
