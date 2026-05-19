import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { motion } from "framer-motion";
import {
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  Users,
  Settings,
} from "lucide-react";

function StatCard({ label, value, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {label}
          </p>

          <h3 className="text-2xl font-bold text-slate-800 mt-2">
            {value}
          </h3>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
          <Icon size={20} />
        </div>
      </div>
    </motion.div>
  );
}

function AdminNavLink({
  to,
  children,
  icon: Icon,
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
            : "bg-white border border-slate-200 text-slate-700 hover:border-cyan-300 hover:text-blue-600 hover:bg-cyan-50"
        }`
      }
    >
      <Icon size={16} />
      {children}
    </NavLink>
  );
}

function AdminProfile() {
  const currentUser = useAuth(
    (state) => state.currentUser
  );

  const logout = useAuth(
    (state) => state.logout
  );

  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initial =
    currentUser?.firstName
      ?.charAt(0)
      .toUpperCase() || "A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 px-4 py-10">
      
      <div className="max-w-6xl mx-auto space-y-6">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] shadow-2xl p-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-5">
              
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                {initial}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck
                    size={16}
                    className="text-blue-600"
                  />

                  <span className="text-sm font-semibold text-blue-600">
                    Administrator
                  </span>
                </div>

                <h1 className="text-4xl font-bold text-slate-800">
                  {currentUser?.firstName}
                </h1>

                <p className="text-slate-500 mt-1">
                  Full platform access and control
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onLogout}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
            >
              <LogOut size={16} />
              Logout
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <StatCard
            label="Dashboard Access"
            value="Active"
            icon={LayoutDashboard}
          />

          <StatCard
            label="Role"
            value="Super Admin"
            icon={ShieldCheck}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <AdminNavLink
            to="dashboard"
            icon={LayoutDashboard}
          >
            Dashboard
          </AdminNavLink>

          <AdminNavLink
            to="users"
            icon={Users}
          >
            Users
          </AdminNavLink>

          <AdminNavLink
            to="settings"
            icon={Settings}
          >
            Settings
          </AdminNavLink>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] shadow-2xl p-6"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}

export default AdminProfile;