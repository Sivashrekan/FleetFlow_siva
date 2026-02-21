from flask import Blueprint, request, jsonify
from db import get_db
from datetime import date
from datetime import date, timedelta   # top of file

trip_bp = Blueprint("trips", __name__)

@trip_bp.route("/", methods=["GET"])
@trip_bp.route("", methods=["GET"])
def get_trips():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            t.*, 
            v.name AS vehicle_name, 
            d.name AS driver_name
        FROM trips t
        LEFT JOIN vehicles v ON t.vehicle_id = v.id
        LEFT JOIN drivers d ON t.driver_id = d.id
    """)

    trips = cursor.fetchall()
    return jsonify(trips)

@trip_bp.route("/dispatch", methods=["POST"])
def dispatch_trip():
    data = request.json
    db = get_db()
    cursor = db.cursor(dictionary=True)

    # 🔥 1. VEHICLE CHECK
    cursor.execute("SELECT * FROM vehicles WHERE id=%s", (data["vehicle_id"],))
    vehicle = cursor.fetchone()

    if not vehicle:
        return jsonify({"error": "Vehicle not found"}), 404

    if vehicle["status"] != "available":
        return jsonify({"error": "Vehicle not available"}), 400

    # 🔥 2. CAPACITY CHECK
    if float(data["cargo_weight"]) > float(vehicle["max_capacity"]):
        return jsonify({"error": "Over capacity"}), 400

    # 🔥 3. DRIVER CHECK
    cursor.execute("SELECT * FROM drivers WHERE id=%s", (data["driver_id"],))
    driver = cursor.fetchone()

    if not driver:
        return jsonify({"error": "Driver not found"}), 404

    # 🔥 LICENSE EXPIRED BLOCK
    expiry = driver["license_expiry"]

    if expiry < date.today():
        return jsonify({"error": "License expired"}), 400

    # 🔥 WARNING SYSTEM
    days_left = (expiry - date.today()).days
    warning = None

    if days_left < 30:
        warning = f"Driver license expires in {days_left} days"

    # 🔥 4. INSERT TRIP
    cursor.execute("""
        INSERT INTO trips(vehicle_id, driver_id, cargo_weight, status)
        VALUES (%s,%s,%s,'dispatched')
    """, (
        data["vehicle_id"],
        data["driver_id"],
        data["cargo_weight"]
    ))

    # 🔥 5. UPDATE VEHICLE STATUS
    cursor.execute(
        "UPDATE vehicles SET status='on_trip' WHERE id=%s",
        (data["vehicle_id"],)
    )

    db.commit()

    return jsonify({
        "msg": "Trip dispatched",
        "warning": warning
    })

@trip_bp.route("/complete/<int:trip_id>", methods=["PUT"])
def complete_trip(trip_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    # get trip
    cursor.execute("SELECT * FROM trips WHERE id=%s", (trip_id,))
    trip = cursor.fetchone()

    if not trip:
        return jsonify({"error": "Trip not found"}), 404

    # update trip
    cursor.execute(
        "UPDATE trips SET status='completed' WHERE id=%s",
        (trip_id,)
    )

    # make vehicle available again
    cursor.execute(
        "UPDATE vehicles SET status='available' WHERE id=%s",
        (trip["vehicle_id"],)
    )

    db.commit()
    return jsonify({"msg": "Trip completed"})

@trip_bp.route("/maintenance", methods=["POST"])
def add_maintenance():
    data = request.json
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO maintenance(vehicle_id, service_type, cost, service_date)
        VALUES (%s,%s,%s,%s)
    """, (
        data["vehicle_id"],
        data["service_type"],
        data["cost"],
        data["service_date"]
    ))

    # auto block vehicle
    cursor.execute(
        "UPDATE vehicles SET status='in_shop' WHERE id=%s",
        (data["vehicle_id"],)
    )

    db.commit()
    return jsonify({"msg": "Maintenance logged"})

@trip_bp.route("/maintenance/complete/<int:vehicle_id>", methods=["PUT"])
def complete_maintenance(vehicle_id):
    db = get_db()
    cursor = db.cursor()

    # make vehicle available again
    cursor.execute(
        "UPDATE vehicles SET status='available' WHERE id=%s",
        (vehicle_id,)
    )

    db.commit()
    return jsonify({"msg": "Maintenance completed"})