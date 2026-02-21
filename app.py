from flask import Flask
from flask_cors import CORS

from routes.vehicles import vehicle_bp
from routes.drivers import driver_bp
from routes.trips import trip_bp
from routes.smart_dispatch import smart_bp
from routes.auth import auth_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(vehicle_bp, url_prefix="/api/vehicles")
app.register_blueprint(driver_bp, url_prefix="/api/drivers")
app.register_blueprint(trip_bp, url_prefix="/api/trips")
app.register_blueprint(smart_bp, url_prefix="/api/smart")
app.register_blueprint(auth_bp, url_prefix="/api/auth")

if __name__ == "__main__":
    app.run(debug=True)