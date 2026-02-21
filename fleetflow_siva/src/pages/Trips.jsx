import { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";

export default function Dispatch() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [activeTrips, setActiveTrips] = useState([]);

  const [form, setForm] = useState({
    vehicle_id: "",
    driver_id: "",
    cargo_weight: "",
  });

  const [message, setMessage] = useState("");

  // 🔥 load all
  const loadData = async () => {
    const v = await API.get("/vehicles");
    const d = await API.get("/drivers");
    const t = await API.get("/trips");

    setVehicles(v.data);
    setDrivers(d.data);

    const dispatched = t.data.filter(
      (x) => x.status === "dispatched"
    );
    setActiveTrips(dispatched);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDispatch = async () => {
    try {
      const res = await API.post("/trips/dispatch", form);
      setMessage(res.data.msg);

      if (res.data.warning) {
        alert(res.data.warning);
      }

      loadData(); // refresh
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  const completeTrip = async (id) => {
    await API.put(`/trips/complete/${id}`);

    // remove instantly
    setActiveTrips((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">

      {/* Dispatch Form */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-md mx-auto"
      >
        <h2 className="text-xl font-bold mb-4 text-center dark:text-white">
          Trip Dispatch
        </h2>

        {/* Vehicle */}
        <select
          name="vehicle_id"
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3 dark:bg-gray-700 dark:text-white"
        >
          <option>Select Vehicle</option>
          {vehicles
            .filter((v) => v.status === "available")
            .map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} - {v.license_plate}
              </option>
            ))}
        </select>

        {/* Driver */}
        <select
          name="driver_id"
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3 dark:bg-gray-700 dark:text-white"
        >
          <option>Select Driver</option>
          {drivers
  .filter((d) => d.status !== "suspended")
  .map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Cargo */}
        <input
          type="number"
          name="cargo_weight"
          placeholder="Cargo Weight"
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4 dark:bg-gray-700 dark:text-white"
        />

        <button
          onClick={handleDispatch}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Dispatch
        </button>

        {message && (
          <p className="text-green-600 mt-2 text-center">{message}</p>
        )}
      </motion.div>

      {/* 🔥 Active Trips */}
      <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
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
                    onClick={() => completeTrip(trip.id)}
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