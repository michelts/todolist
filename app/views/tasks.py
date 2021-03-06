from flask import jsonify, request
from flask.blueprints import Blueprint
from flask_login import current_user, login_required

from .. import models, validators

blueprint = Blueprint("tasks", __name__)


@blueprint.route("/", methods=["GET"])
@login_required
def task_list():
    query = models.Task.query.filter(
        models.Task.user_id == current_user.id,
        models.Task.is_removed == False,  # noqa: E712
    )

    sort_field = request.args.get("sort", "due_date")
    if sort_field == "priority":
        query = query.order_by(models.Task.priority.desc())
    else:
        query = query.order_by(models.Task.due_date)

    return jsonify([obj.serialize() for obj in query])


@blueprint.route("/", methods=["POST"])
@login_required
def task_create():
    schema = validators.TaskCreateSchema()
    errors = schema.validate(request.json)
    if errors:
        return (jsonify(errors), 400)

    payload = schema.load(request.json)
    obj = models.Task(user_id=current_user.id, **payload)
    models.db.session.add(obj)
    models.db.session.commit()

    return (jsonify(obj.serialize()), 201)


@blueprint.route("/<int:task_id>/", methods=["PUT"])
@login_required
def task_update(task_id):
    schema = validators.TaskUpdateSchema()
    errors = schema.validate(request.json)
    if errors:
        return (jsonify(errors), 400)

    payload = schema.load(request.json)
    obj = models.Task.query.get(task_id)
    for key, value in payload.items():
        setattr(obj, key, value)
    models.db.session.add(obj)
    models.db.session.commit()

    return (jsonify(obj.serialize()), 200)


@blueprint.route("/<int:task_id>/", methods=["DELETE"])
@login_required
def task_destroy(task_id):
    obj = models.Task.query.get(task_id)
    obj.is_removed = True
    models.db.session.add(obj)
    models.db.session.commit()

    return ("", 204)
