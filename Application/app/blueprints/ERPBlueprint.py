from flask import Blueprint, request, abort
from managers import ERPManager

blueprint = Blueprint("ERPs", __name__)

@blueprint.route("/get")
def get_erps():
    
    return {
        # "ERPs": ERPManager.get_erp(lat, lon, radius)
        "ERPs": ERPManager.get_erp_loc()
    }
