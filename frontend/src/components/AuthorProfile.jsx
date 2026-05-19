import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  PenSquare,
  FileText,
  LogOut,
} from "lucide-react";

function AuthorProfile() {
  const currentUser = useAuth(
    (state) => state.currentUser
  );

  const logout = useAuth(
    (state) => state.logout
  );

  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();

    toast.success("Logout Successful");

    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-200"
        : "bg-white text-gray-700 border border-gray-200 hover:border-cyan-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-600"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-10">
      
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-xl p-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

            {/* LEFT */}
            <div className="flex items-center gap-5">

              {/* Avatar */}
              {currentUser?.profileImageUrl ? (
                <img
                  src={currentUser.profileImageUrl}
                  alt="profile"
                  className="w-20 h-20 rounded-3xl object-cover shadow-xl border border-white"
                />
              ) : (
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                  {currentUser?.firstName
                    ?.charAt(0)
                    .toUpperCase()}
                </div>
              )}

              {/* USER INFO */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <PenSquare
                    size={16}
                    className="text-blue-600"
                  />

                  <span className="text-sm font-medium text-blue-600">
                    Author Dashboard
                  </span>
                </div>

                <h1 className="text-4xl font-bold text-gray-800">
                  {currentUser?.firstName}
                </h1>

                <p className="text-gray-500 mt-1">
                  Manage your articles and content
                </p>
              </div>
            </div>

            {/* LOGOUT */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onLogout}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
            >
              <LogOut size={16} />
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* NAVIGATION */}
        <div className="flex flex-wrap gap-3">
          
          <NavLink
            to="articles"
            className={navClass}
          >
            <FileText size={16} />
            Articles
          </NavLink>

          <NavLink
            to="write-article"
            className={navClass}
          >
            <PenSquare size={16} />
            Write Article
          </NavLink>
        </div>

        {/* CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-xl p-6"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}

export default AuthorProfile;