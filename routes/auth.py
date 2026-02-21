from flask import Blueprint, request, jsonify
from db import get_db
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint("auth", __name__)


# REGISTER
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    db = get_db()
    cursor = db.cursor(dictionary=True)

    # check email
    cursor.execute("SELECT * FROM users WHERE email=%s", (data["email"],))
    if cursor.fetchone():
        return jsonify({"error": "Email already exists"}), 400

    password_hash = generate_password_hash(data["password"])

    cursor.execute("""
        INSERT INTO users(name,email,password_hash,role)
        VALUES (%s,%s,%s,%s)
    """, (
        data["name"],
        data["email"],
        password_hash,
        data["role"]
    ))

    db.commit()
    return jsonify({"msg": "User registered"})


# LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email=%s", (data["email"],))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "Invalid email"}), 400

    if not check_password_hash(user["password_hash"], data["password"]):
        return jsonify({"error": "Wrong password"}), 400

    return jsonify({
        "msg": "Login success",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "role": user["role"]
        }
    })
@auth_bp.route("/forgot", methods=["POST"])
def forgot():
    data = request.json
    return jsonify({"msg": "Reset link sent"})