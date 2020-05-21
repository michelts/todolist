from flask import jsonify
from flask.blueprints import Blueprint
from .models import Task

blueprint = Blueprint("todos", __name__)


@blueprint.route("/tasks/")
def task_list():
    return jsonify(
        [
            obj.serialize()
            for obj in Task.query.all()
        ]
    )
