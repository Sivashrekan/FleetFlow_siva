import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Vehicles from "./pages/Vehicles";
import Layout from "./components/Layout";
import Trips from "./pages/Trips";
import Dashboard from "./pages/Dashboard";
import Maintenance from "./pages/Maintenance";
import Drivers from "./pages/Drivers";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Forgot from "./pages/Forgot";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [dark, setDark] = useState(false);

  // 🔥 Load theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDark(true);
  }, []);

  // 🔥 Save theme
  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className={dark ? "dark" : ""}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

          <Routes>

            {/* ================= PUBLIC ================= */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />

            {/* ================= PROTECTED ================= */}
            <Route
              path="/"
              element={
                <ProtectedRoute
                  roles={[
                    "admin",
                    "fleet_manager",
                    "dispatcher",
                    "safety_officer",
                    "financial_analyst",
                  ]}
                >
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* 🔥 IMPORTANT: dashboard default */}
              <Route index element={<Dashboard />} />

              <Route
                path="vehicles"
                element={
                  <ProtectedRoute roles={["admin", "fleet_manager"]}>
                    <Vehicles />
                  </ProtectedRoute>
                }
              />

              <Route
                path="trips"
                element={
                  <ProtectedRoute roles={["admin", "dispatcher"]}>
                    <Trips />
                  </ProtectedRoute>
                }
              />

              <Route
                path="maintenance"
                element={
                  <ProtectedRoute roles={["admin", "safety_officer"]}>
                    <Maintenance />
                  </ProtectedRoute>
                }
              />

              <Route
                path="drivers"
                element={
                  <ProtectedRoute roles={["admin", "fleet_manager"]}>
                    <Drivers />
                  </ProtectedRoute>
                }
              />
            </Route>

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;