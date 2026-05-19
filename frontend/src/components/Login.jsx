import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const {
    login,
    currentUser,
    loading,
    error,
    isAuthenticated,
  } = useAuth((state) => state);

  const onUserLogin = (userCredObj) => {
    login(userCredObj);
  };

  useEffect(() => {
    if (isAuthenticated === true) {
      toast.success("Login successful");

      if (currentUser.role === "USER") {
        navigate("/user-profile");
      }

      if (currentUser.role === "AUTHOR") {
        navigate("/author-profile");
      }

      if (currentUser.role === "ADMIN") {
        navigate("/admin-profile");
      }
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-sky-50 to-cyan-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Login to your account
        </p>

        {error && (
          <p className="bg-red-100 text-red-500 text-sm p-3 rounded-lg mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onUserLogin)}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
              {...register("email", {
                required: "Email is required",
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
              {...register("password", {
                required: "Password is required",
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="text-right mb-5">
            <NavLink
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </NavLink>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-medium shadow-md hover:opacity-90 transition"
          >
            {loading ? "Signing In..." : "Sign In"}
          </motion.button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <NavLink
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register
          </NavLink>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;