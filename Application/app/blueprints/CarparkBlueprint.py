from flask import Blueprint, request, abort
from managers import CarparkManager

blueprint = Blueprint("carparks", __name__)

@blueprint.route("/get")
def get_nearby_carparks():
    try:
        lat = request.args.get("lat")
        lon = request.args.get("lon")
        if not lat or not lon:
            raise Exception()
        
        lat = float(lat)
        lon = float(lon)
    except:
        abort(400)

    try:
        radius = request.args.get("radius")

        if not radius:
            raise Exception()
        
        radius = float(radius)
    except:
        radius = 5
    
    return {
        "carparks": CarparkManager.get_nearby_carparks(lat, lon, radius)
    }
