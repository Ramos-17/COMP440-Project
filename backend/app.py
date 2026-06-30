from flask import Flask, jsonify
from flask_cors import CORS
from main.login import auth
from main.items import items


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(auth, url_prefix="/api")
    app.register_blueprint(items, url_prefix="/api")

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    @app.get("/api/message")
    def message():
        return jsonify({"message": "Hello from Flask"})

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
