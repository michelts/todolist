from flask import Flask
from flask_migrate import Migrate
from .views import blueprint
from .models import db, login_manager


def create_app(DATABASE_URI="sqlite:////tmp/database.db", DEBUG=True):

    app = Flask(__name__)
    app.config["DEBUG"] = DEBUG
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    Migrate(app, db)
    db.init_app(app)

    login_manager.init_app(app)
    login_manager.login_message = "You must be logged in to access this page."
    login_manager.login_view = "auth.login"

    app.register_blueprint(blueprint, url_prefix="/api/v1/")
    return app


if __name__ == "__main__":
    app = create_app()
    app.run()
