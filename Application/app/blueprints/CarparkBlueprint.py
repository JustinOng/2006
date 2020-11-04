from flask import Blueprint, request, abort
from managers import CarparkManager

blueprint = Blueprint("carparks", __name__)

@blueprint.route("/get", methods=["GET", "POST"])
def get_nearby_carparks():
    lat = request.json.get("lat")
    lon = request.json.get("lon")
    radius = request.json.get("radius")

    if not lat or not lon or not radius:
        return {
            "carparks": CarparkManager.get_nearby_carparks(None, None, None)
        }

    lat = float(lat)
    lon = float(lon)

    return {
        "carparks": CarparkManager.get_nearby_carparks(lat, lon, radius)
    }
