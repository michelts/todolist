from flask import jsonify
from flask.blueprints import Blueprint
from flask_login import current_user
from werkzeug.exceptions import NotFound

blueprint = Blueprint("users", __name__)


@blueprint.route("/current/", methods=["GET"])
def current_user_detail():
    if not current_user.is_authenticated:
        raise NotFound()
    return jsonify(current_user.serialize())
