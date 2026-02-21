import { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";

export default function Maintenance() {
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceVehicles, setMaintenanceVehicles] = useState([]);

  const [form, setForm] = useState({
    vehicle_id: "",
    service_type: "",
    cost: "",
    service_date: "",
  });

  // load
  const loadData = async () => {
    const res = await API.get("/vehicles");
    setVehicles(res.data);

    const inShop = res.data.filter(
      (v) => v.status === "in_shop"
    );
    setMaintenanceVehicles(inShop);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitMaintenance = async () => {
    await API.post("/trips/maintenance", form);

    setForm({
      vehicle_id: "",
      service_type: "",
      cost: "",
      service_date: "",
    });

    loadData();
  };

  const finishMaintenance = async (id) => {
    await API.put(`/trips/maintenance/complete/${id}`);
    loadData();
  };

  return (
    <div className="p-6">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold mb-4 dark:text-white"
      >
        Maintenance Management
      </motion.h2>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-3 dark:text-white">
          Log Maintenance
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <select
            name="vehicle_id"
            value={form.vehicle_id}
            onChange={handleChange}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
          >
            <option>Select Vehicle</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>

          <input
            name="service_type"
            placeholder="Service type"
            value={form.service_type}
            onChange={handleChange}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
          />

          <input
            type="number"
            name="cost"
            placeholder="Cost"
            value={form.cost}
            onChange={handleChange}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
          />

          <input
            type="date"
            name="service_date"
            value={form.service_date}
            onChange={handleChange}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          onClick={submitMaintenance}
          className="mt-4 bg-amber-500 text-white px-4 py-2 rounded"
        >
          Log Maintenance
        </button>
      </div>

      {/* 🔥 Current Maintenance Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-3 dark:text-white">
          Vehicles Under Maintenance
        </h3>

        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-2">Vehicle</th>
              <th className="p-2">Plate</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {maintenanceVehicles.map((v) => (
              <tr key={v.id} className="border-b">
                <td className="p-2">{v.name}</td>
                <td className="p-2">{v.license_plate}</td>

                <td className="p-2">
                  <button
                    onClick={() => finishMaintenance(v.id)}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Finish
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