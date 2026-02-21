import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 ml-60">
        <Navbar />

        <div className="p-6">
          <Outlet />  {/* 🔥 THIS SHOWS PAGE */}
        </div>
      </div>
    </div>
  );
}