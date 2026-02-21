import { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
  name: "",
  license_number: "",
  license_expiry: "",
  license_category: "LMV",
});

  // load
  const loadDrivers = async () => {
    const res = await API.get("/drivers");
    setDrivers(res.data);
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // add
  const addDriver = async () => {
    await API.post("/drivers", form);
    loadDrivers();
    resetForm();
  };

  // delete
  const deleteDriver = async (id) => {
    if (!confirm("Delete driver?")) return;
    await API.delete(`/drivers/${id}`);
    loadDrivers();
  };

  // edit
  const startEdit = (d) => {
    setEditId(d.id);
    setForm({
      name: d.name,
      license_number: d.license_number,
      license_expiry: d.license_expiry,
      license_category: d.license_category,
    });
  };

  // update
  const updateDriver = async () => {
    await API.put(`/drivers/${editId}`, form);
    loadDrivers();
    resetForm();
    setEditId(null);
  };

  const resetForm = () => {
    setForm({
      name: "",
      license_number: "",
      license_expiry: "",
      license_category: "",
    });
  };

  // expiry warning
  const expiryColor = (date) => {
    const today = new Date();
    const expiry = new Date(date);
    const days = (expiry - today) / (1000 * 60 * 60 * 24);

    if (days < 0) return "text-red-600";
    if (days < 30) return "text-amber-500";
    return "";
  };

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold mb-4 dark:text-white"
      >
        Driver Management
      </motion.h2>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-4">
        <h3 className="font-semibold mb-2 dark:text-white">
          {editId ? "Edit Driver" : "Add Driver"}
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <input
            name="name"
            placeholder="Driver Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
          />

          <input
            name="license_number"
            placeholder="License Number"
            value={form.license_number}
            onChange={handleChange}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
          />

          <input
            type="date"
            name="license_expiry"
            value={form.license_expiry}
            onChange={handleChange}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
          />

          <select
  name="license_category"
  value={form.license_category}
  onChange={handleChange}
  className="border p-2 rounded dark:bg-gray-700 dark:text-white"
>
  <option value="">Select Category</option>
  <option value="LMV">LMV (Light Motor Vehicle)</option>
  <option value="HMV">HMV (Heavy Motor Vehicle)</option>
  <option value="MCWG">MCWG (Bike)</option>
</select>
        </div>

        <button
          onClick={editId ? updateDriver : addDriver}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update Driver" : "Add Driver"}
        </button>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 shadow rounded-xl"
      >
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">License</th>
              <th className="p-2">Expiry</th>
              <th className="p-2">Category</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {drivers.map((d) => (
              <tr key={d.id} className="border-b">
                <td className="p-2">{d.name}</td>
                <td className="p-2">{d.license_number}</td>
                <td className={`p-2 ${expiryColor(d.license_expiry)}`}>
                  {d.license_expiry}
                </td>
                <td className="p-2">{d.license_category}</td>

                <td className="p-2 flex gap-2">
                  {d.status === "suspended" ? (
                    <button
                      onClick={async () => {
                        await API.put(`/drivers/activate/${d.id}`);
                        loadDrivers();
                      }}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Activate
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(d)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                  
                      <button
                        onClick={() => deleteDriver(d.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Suspend
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}