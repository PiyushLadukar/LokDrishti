from flask import Flask
from app.config import Config
from app.db import init_db


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize database
    init_db(app)

    # Register Blueprints
    from app.routes.mp_routes import mp_bp
    from app.routes.ranking_routes import ranking_bp
    from app.routes.index_routes import index_bp

    app.register_blueprint(mp_bp,      url_prefix="/api")
    app.register_blueprint(ranking_bp, url_prefix="/api")
    app.register_blueprint(index_bp,   url_prefix="/api")

    # Health check
    @app.route("/")
    def health():
        return {"status": "ok", "project": "LokDrishti", "version": "1.0"}

    return app