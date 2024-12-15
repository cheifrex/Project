from flask import Flask
from resume import resume_api


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'sk-QA'

    from .routes import main
    app.register_blueprint(resume_api, url_prefix="/api")

    return app


