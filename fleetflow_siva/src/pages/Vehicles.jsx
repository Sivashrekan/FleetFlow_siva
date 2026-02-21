import { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    model: "",
    license_plate: "",
    max_capacity: "",
    vehicle_type: "truck",
  });

  // Load vehicles
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const res = await API.get("/vehicles");
    setVehicles(res.data);
  };

  // Form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add
  const addVehicle = async () => {
    try {
      await API.post("/vehicles", form);
      loadVehicles();

      setForm({
        name: "",
        model: "",
        license_plate: "",
        max_capacity: "",
        vehicle_type: "truck",
      });
    } catch {
      alert("Error adding vehicle");
    }
  };

  // Delete
  const deleteVehicle = async (id) => {
    if (!confirm("Delete vehicle?")) return;

    await API.delete(`/vehicles/${id}`);
    loadVehicles();
  };

  // Start edit
  const startEdit = (v) => {
    setEditId(v.id);
    setForm({
      name: v.name,
      model: v.model,
      license_plate: v.license_plate,
      max_capacity: v.max_capacity,
      vehicle_type: v.vehicle_type,
    });
  };

  // Update
  const updateVehicle = async () => {
  await API.put(`/vehicles/${editId}`, form);
  loadVehicles();

  // 🔥 reset form
  setForm({
    name: "",
    model: "",
    license_plate: "",
    max_capacity: "",
    vehicle_type: "truck",
  });

  setEditId(null);
};

  const statusColor = (status) => {
    if (status === "available") return "bg-green-500";
    if (status === "on_trip") return "bg-red-500";
    if (status === "in_shop") return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-4 dark:text-white"
      >
        Fleet Vehicles
      </motion.h2>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-4">
        <h3 className="font-semibold mb-2 dark:text-white">
          {editId ? "Edit Vehicle" : "Add Vehicle"}
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <input
            name="name"
            placeholder="Vehicle Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
          />

          <input
            name="model"
            placeholder="Model"
            value={form.model}
            onChange={handleChange}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
          />

          <input
            name="license_plate"
            placeholder="License Plate"
            value={form.license_plate}
            onChange={handleChange}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
          />

          <input
            name="max_capacity"
            placeholder="Capacity"
            value={form.max_capacity}
            onChange={handleChange}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
          />

          <select
            name="vehicle_type"
            value={form.vehicle_type}
            onChange={handleChange}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="truck">Truck</option>
            <option value="van">Van</option>
            <option value="bike">Bike</option>
          </select>
        </div>

        <button
          onClick={editId ? updateVehicle : addVehicle}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update Vehicle" : "Add Vehicle"}
        </button>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden"
      >
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Plate</th>
              <th className="p-3">Type</th>
              <th className="p-3">Capacity</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} className="border-b dark:border-gray-700">
                <td className="p-3 dark:text-white">{v.name}</td>
                <td className="p-3 dark:text-gray-300">
                  {v.license_plate}
                </td>
                <td className="p-3 dark:text-gray-300">
                  {v.vehicle_type}
                </td>
                <td className="p-3 dark:text-gray-300">
                  {v.max_capacity}
                </td>

                <td className="p-3">
                  <span
                    className={`text-white px-2 py-1 rounded ${statusColor(
                      v.status
                    )}`}
                  >
                    {v.status}
                  </span>
                </td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => startEdit(v)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteVehicle(v.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}