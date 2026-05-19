import {
  divider,
  errorClass,
  formGroup,
  labelClass,
  mutedText,
} from "../styles/common";

import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { motion } from "framer-motion";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth((state) => state);

  const onUserRegister = async (userObj) => {
    const formData = new FormData();

    formData.append("firstName", userObj.firstName);
    formData.append("lastName", userObj.lastName);
    formData.append("email", userObj.email);
    formData.append("password", userObj.password);
    formData.append("role", userObj.role);

    if (userObj.profileImageUrl?.[0]) {
      formData.append("profileImageUrl", userObj.profileImageUrl[0]);
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `https://capstone-lq6s.onrender.com/common-api/users`,
        formData,
        { withCredentials: true },
      );

      if (res.status === 201) {
        await login({
          email: userObj.email,
          password: userObj.password,
        });

        navigate("/");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed";

      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-sky-50 to-cyan-100 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8"
      >
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Join and start your journey
        </p>

        {apiError && (
          <div className="bg-red-100 text-red-500 text-sm p-3 rounded-lg mb-5">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onUserRegister)}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">
              Register As
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label>
                <input
                  type="radio"
                  value="USER"
                  className="hidden peer"
                  {...register("role", {
                    required: "Select a role",
                  })}
                />

                <div className="border border-gray-200 rounded-xl p-4 text-center cursor-pointer transition peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-cyan-500 peer-checked:text-white">
                  User
                </div>
              </label>

              <label>
                <input
                  type="radio"
                  value="AUTHOR"
                  className="hidden peer"
                  {...register("role", {
                    required: "Select a role",
                  })}
                />

                <div className="border border-gray-200 rounded-xl p-4 text-center cursor-pointer transition peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-cyan-500 peer-checked:text-white">
                  Author
                </div>
              </label>
            </div>

            {errors.role && (
              <p className={`${errorClass} mt-2`}>{errors.role.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>First Name</label>

              <input
                type="text"
                placeholder="First name"
                className="w-full mt-2 border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                {...register("firstName", {
                  required: "First name is required",
                })}
              />

              {errors.firstName && (
                <p className={errorClass}>{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Last Name</label>

              <input
                type="text"
                placeholder="Last name"
                className="w-full mt-2 border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                {...register("lastName")}
              />

              {errors.lastName && (
                <p className={errorClass}>{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Email</label>

            <input
              type="email"
              placeholder="Enter email"
              className="w-full mt-2 border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
              {...register("email", {
                required: "Email is required",
              })}
            />

            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              className="w-full mt-2 border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
              {...register("password", {
                required: "Password is required",
              })}
            />

            {errors.password && (
              <p className={errorClass}>{errors.password.message}</p>
            )}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Profile Image</label>

            <input
              type="file"
              accept="image/png, image/jpeg"
              className="w-full mt-2 border border-gray-200 bg-gray-50 rounded-xl px-4 py-3"
              {...register("profileImageUrl")}
              onChange={(event) => {
                let file = event.target.files[0];

                if (file) {
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />

            {preview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-4"
              >
                <img
                  src={preview}
                  alt="preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </motion.div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-medium shadow-md hover:opacity-90 transition"
          >
            {loading ? "Creating..." : "Create Account"}
          </motion.button>
        </form>

        <p className={`${mutedText} text-center mt-6`}>
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign In
          </NavLink>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
