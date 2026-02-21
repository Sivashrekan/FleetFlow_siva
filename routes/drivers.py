from flask import Blueprint, request, jsonify
from db import get_db

driver_bp = Blueprint("drivers", __name__)


# 🔥 GET all drivers
@driver_bp.route("", methods=["GET"])
@driver_bp.route("/", methods=["GET"])
def get_drivers():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM drivers")
    return jsonify(cursor.fetchall())


# 🔥 ADD driver
@driver_bp.route("", methods=["POST"])
@driver_bp.route("/", methods=["POST"])
def add_driver():
    data = request.json
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO drivers(name, license_number, license_expiry, license_category)
        VALUES (%s,%s,%s,%s)
    """, (
        data["name"],
        data["license_number"],
        data["license_expiry"],
        data.get("license_category", "LMV")
    ))

    db.commit()
    return jsonify({"msg": "Driver added"})


# 🔥 UPDATE driver
@driver_bp.route("/<int:id>", methods=["PUT"])
def update_driver(id):
    data = request.json
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        UPDATE drivers
        SET name=%s,
            license_number=%s,
            license_expiry=%s,
            license_category=%s
        WHERE id=%s
    """, (
        data["name"],
        data["license_number"],
        data["license_expiry"],
        data["license_category"],
        id
    ))

    db.commit()
    return jsonify({"msg": "Driver updated"})


# 🔥 DELETE driver
@driver_bp.route("/<int:id>", methods=["DELETE"])
def delete_driver(id):
    db = get_db()
    cursor = db.cursor()

    # soft delete → suspend driver
    cursor.execute(
        "UPDATE drivers SET status='suspended' WHERE id=%s",
        (id,)
    )

    db.commit()
    return jsonify({"msg": "Driver suspended"})

@driver_bp.route("/activate/<int:id>", methods=["PUT"])
def activate_driver(id):
    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "UPDATE drivers SET status='available' WHERE id=%s",
        (id,)
    )

    db.commit()
    return jsonify({"msg": "Driver activated"})