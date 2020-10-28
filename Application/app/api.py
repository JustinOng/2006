from flask import send_from_directory

from blueprints import CarparkBlueprint, TrafficImageBlueprint, ERPBlueprint

from app import app

app.register_blueprint(CarparkBlueprint.blueprint, url_prefix = "/api/carparks")
app.register_blueprint(TrafficImageBlueprint.blueprint, url_prefix = "/api/trafficimages")
app.register_blueprint(ERPBlueprint.blueprint, url_prefix = "/api/ERPs")

@app.route("/")
def index():
    return app.send_static_file("index.html")
