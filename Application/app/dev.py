from flask import Flask, send_from_directory
app = Flask(__name__,
            static_url_path="",
            static_folder="static/")

@app.route("/")
def index():
    return app.send_static_file("index.html")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")