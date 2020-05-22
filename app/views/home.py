from flask import render_template
from flask.blueprints import Blueprint

blueprint = Blueprint(
    "home", __name__, template_folder="./templates/", static_folder="./static/"
)


@blueprint.route("/")
def home():
    return render_template("home.html")
