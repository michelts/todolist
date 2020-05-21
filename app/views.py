from flask import jsonify
from flask.blueprints import Blueprint
from flask_login import login_required
from .models import Task

blueprint = Blueprint("todos", __name__)


@blueprint.route("/tasks/")
@login_required
def task_list():
    return jsonify(
        [
            obj.serialize()
            for obj in Task.query.all()
        ]
    )
