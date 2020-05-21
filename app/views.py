import json
from flask import request, jsonify, abort
from flask.blueprints import Blueprint
from flask_login import login_required, current_user

from . import models, validators

blueprint = Blueprint("todos", __name__)


@blueprint.route("/tasks/", methods=["GET"])
@login_required
def task_list():
    return jsonify([obj.serialize() for obj in models.Task.query.all()])


@blueprint.route("/tasks/", methods=["POST"])
@login_required
def task_create():
    schema = validators.TaskSchema()
    errors = schema.validate(request.json)
    if errors:
        return abort(400, json.dumps(errors))

    payload = schema.load(request.json)
    obj = models.Task(user_id=current_user.id, **payload)
    models.db.session.add(obj)
    models.db.session.commit()

    return jsonify(obj.serialize()), 201
