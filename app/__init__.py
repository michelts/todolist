from flask import Flask
from flask_migrate import Migrate

from .models import db, login_manager
from .views import blueprint


def create_app(DATABASE_URI="sqlite:////tmp/database.db", DEBUG=True):

    app = Flask(__name__)
    app.config["DEBUG"] = DEBUG
    app.config["SECRET_KEY"] = "some-secret-key"
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    Migrate(app, db)
    db.init_app(app)

    login_manager.init_app(app)

    app.register_blueprint(blueprint, url_prefix="/api/v1/")
    return app


if __name__ == "__main__":
    app = create_app()
    app.run()
