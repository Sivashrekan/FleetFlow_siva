import { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [stats, setStats] = useState({
    vehicles: 0,
    available: 0,
    trips: 0,
    drivers: 0,
    maintenance: 0,
  });

  const [activeTrips, setActiveTrips] = useState([]);

  useEffect(() => {
  async function load() {
    try {
      const v = await API.get("/vehicles");
      const d = await API.get("/drivers");
      const t = await API.get("/trips");

      const vehicles = v.data.length;

      const available = v.data.filter(
        (x) => x.status === "available"
      ).length;

      const maintenance = v.data.filter(
        (x) => x.status === "in_shop"
      ).length;

      const dispatched = t.data.filter(
        (x) => x.status === "dispatched"
      );

      const drivers = d.data.length;

      setStats({
        vehicles,
        available,
        trips: dispatched.length,
        drivers,
        maintenance,
      });

      setActiveTrips(dispatched);

    } catch (err) {
      console.error("Dashboard error:", err);
    }
  }

  load();

  const interval = setInterval(load, 5000);
  return () => clearInterval(interval);
}, []);

  const Card = ({ title, value, color }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-6 rounded-xl shadow text-white ${color}`}
    >
      <h3 className="text-lg">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </motion.div>
  );

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold mb-4 dark:text-white"
      >
        Fleet Command Center
      </motion.h2>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <Card title="Total Fleet" value={stats.vehicles} color="bg-blue-600" />
        <Card title="Available" value={stats.available} color="bg-green-600" />
        <Card title="Active Trips" value={stats.trips} color="bg-amber-500" />
        <Card title="Drivers" value={stats.drivers} color="bg-purple-600" />

        {/* 🔥 Maintenance Alert */}
        <Card
          title="In Maintenance"
          value={stats.maintenance}
          color="bg-red-600"
        />
      </div>

      {/* Active Trips Table */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-3 dark:text-white">
          Active Trips
        </h3>

        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-2">Vehicle</th>
              <th className="p-2">Driver</th>
              <th className="p-2">Cargo</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {activeTrips.map((trip) => (
              <tr key={trip.id} className="border-b">
                <td className="p-2">{trip.vehicle_name}</td>
                <td className="p-2">{trip.driver_name}</td>
                <td className="p-2">{trip.cargo_weight}</td>

                <td className="p-2">
                  <button
                    onClick={async () => {
                      await API.put(`/trips/complete/${trip.id}`);

                      // remove instantly
                      setActiveTrips((prev) =>
                        prev.filter((t) => t.id !== trip.id)
                      );
                    }}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Complete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}