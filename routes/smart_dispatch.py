from flask import Blueprint, jsonify
from db import get_db

smart_bp = Blueprint("smart", __name__)

@smart_bp.route("/suggest", methods=["GET"])
def suggest_vehicle():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM vehicles WHERE status='available'")
    vehicles = cursor.fetchall()

    if not vehicles:
        return jsonify({"msg": "No vehicles"})

    # simple smart score
    best = max(vehicles, key=lambda v: float(v["max_capacity"]))

    return jsonify({
        "recommended_vehicle": best["license_plate"],
        "reason": "Highest capacity and availability"
    })