from flask import send_from_directory

from blueprints import CarparkBlueprint

from app import app

app.register_blueprint(CarparkBlueprint.blueprint, url_prefix = "/api/carparks")

@app.route("/")
def index():
    return app.send_static_file("index.html")
