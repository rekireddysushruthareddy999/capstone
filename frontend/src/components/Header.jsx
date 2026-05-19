import { NavLink } from "react-router";
import { useAuth } from "../store/authStore";
import { motion } from "framer-motion";
import {
  PenSquare,
  LogIn,
  UserPlus,
  ShieldCheck,
} from "lucide-react";

function Header() {
  const isAuthenticated = useAuth(
    (state) => state.isAuthenticated
  );

  const user = useAuth(
    (state) => state.currentUser
  );

  const getProfilePath = () => {
    if (!user) return "/";

    switch (user.role) {
      case "AUTHOR":
        return "/author-profile";

      case "ADMIN":
        return "/admin-profile";

      default:
        return "/user-profile";
    }
  };

  const buttonClass = ({ isActive }) =>
    `flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-200"
        : "bg-white text-gray-700 border border-gray-200 hover:border-cyan-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-600"
    }`;

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <NavLink to="/">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
              <PenSquare
                className="text-white"
                size={22}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                BlogApp
              </h1>
            </div>
          </motion.div>
        </NavLink>

        <ul className="flex items-center gap-3">
          
          <li>
            <NavLink
              to="/"
              end
              className={buttonClass}
            >
              Home
            </NavLink>
          </li>

          {!isAuthenticated && (
            <>
              <li>
                <NavLink
                  to="/register"
                  className={buttonClass}
                >
                  <UserPlus size={16} />
                  Register
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/login"
                  className={buttonClass}
                >
                  <LogIn size={16} />
                  Login
                </NavLink>
              </li>
            </>
          )}

          {isAuthenticated && (
            <li>
              <NavLink
                to={getProfilePath()}
                className={buttonClass}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md">
                  {user?.firstName
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm font-semibold">
                    {user?.firstName}
                  </p>

                  <p className="text-xs opacity-80">
                    {user?.role === "ADMIN" ? (
                      <span className="flex items-center gap-1">
                        <ShieldCheck size={12} />
                        Admin
                      </span>
                    ) : user?.role === "AUTHOR" ? (
                      "Author"
                    ) : (
                      "User"
                    )}
                  </p>
                </div>
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </motion.nav>
  );
}

export default Header;