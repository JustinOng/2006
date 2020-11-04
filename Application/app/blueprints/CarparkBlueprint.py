from flask import Blueprint, request, abort
from managers import CarparkManager

blueprint = Blueprint("carparks", __name__)

@blueprint.route("/get", methods=["GET", "POST"])
def get_nearby_carparks():
    if not request.json is None:
        lat = request.json.get("lat")
        lon = request.json.get("lon")
        radius = request.json.get("radius")

        if lat and lon and radius:
            lat = float(lat)
            lon = float(lon)

            return {
                "carparks": CarparkManager.get_nearby_carparks(lat, lon, radius)
            }

    
    return {
        "carparks": CarparkManager.get_nearby_carparks(None, None, None)
    }
