from flask import jsonify, request
from flask.blueprints import Blueprint
from flask_login import current_user, login_user
from sqlalchemy.orm.exc import NoResultFound
from werkzeug.exceptions import NotFound
from .. import models, validators

blueprint = Blueprint("users", __name__)


@blueprint.route("/current/", methods=["GET"])
def current_user_detail():
    if not current_user.is_authenticated:
        raise NotFound()
    return jsonify(current_user.serialize())


authentication_failed_response = {"non_field_errors": ["Authentication failed"]}


@blueprint.route("/login/", methods=["POST"])
def user_login():
    schema = validators.UserLoginSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 401

    payload = schema.load(request.json)
    query = models.User.query.filter(models.User.username == payload["username"])
    try:
        user = query.one()
    except NoResultFound:
        return authentication_failed_response, 401

    if not user.verify_password(payload["password"]):
        return authentication_failed_response, 401

    login_user(user)

    return jsonify(user.serialize())
