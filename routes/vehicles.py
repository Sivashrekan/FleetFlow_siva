from flask import Blueprint, request, jsonify
from db import get_db

vehicle_bp = Blueprint("vehicles", __name__)

@vehicle_bp.route("", methods=["GET"])
@vehicle_bp.route("/", methods=["GET"])
def get_vehicles():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM vehicles")
    data = cursor.fetchall()
    return jsonify(data)

@vehicle_bp.route("/", methods=["POST"])
@vehicle_bp.route("", methods=["POST"])
def add_vehicle():
    data = request.json
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO vehicles(name, model, license_plate, max_capacity, vehicle_type)
        VALUES (%s,%s,%s,%s,%s)
    """, (
        data["name"],
        data["model"],
        data["license_plate"],
        data["max_capacity"],
        data["vehicle_type"]
    ))

    db.commit()
    return jsonify({"msg": "Vehicle added"})

@vehicle_bp.route("/<int:id>", methods=["DELETE"])
def delete_vehicle(id):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("DELETE FROM vehicles WHERE id=%s", (id,))
    db.commit()

    return jsonify({"msg": "Vehicle deleted"})


@vehicle_bp.route("/<int:id>", methods=["PUT"])
def update_vehicle(id):
    data = request.json
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        UPDATE vehicles
        SET name=%s, model=%s, license_plate=%s, max_capacity=%s, vehicle_type=%s
        WHERE id=%s
    """, (
        data["name"],
        data["model"],
        data["license_plate"],
        data["max_capacity"],
        data["vehicle_type"],
        id
    ))

    db.commit()
    return jsonify({"msg": "Vehicle updated"})