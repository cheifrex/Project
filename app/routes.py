from flask import Blueprint, render_template

main = Blueprint('main', __name__)

@main.route("/")
def home():
    return render_template("index.html")

@main.route("/resume-generator")
def resume_generator():
    return render_template("resume_generator.html")
