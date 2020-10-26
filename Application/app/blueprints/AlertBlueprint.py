from flask import Blueprint
from managers import AlertManager

blueprint = Blueprint("alert", __name__)

@blueprint.route("/get")
def get_alerts():
    return {
        "alerts": AlertManager.get_alerts()
    }
