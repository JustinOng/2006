import io
from flask import Blueprint, request, abort, send_file
from managers import TrafficImageManager

blueprint = Blueprint("trafficimage", __name__)

@blueprint.route("/all")
def get_all_cameras():
    return {
        "cameras": TrafficImageManager.get_traffic_images_list()
    }

@blueprint.route("/get")
def get_image():
    try:
        _id = request.args.get("id")
        if not _id:
            raise Exception()
    except:
        abort(400)
    
    return send_file(
        io.BytesIO(TrafficImageManager.get_traffic_image(_id)),
        mimetype='image/jpeg'
    )
