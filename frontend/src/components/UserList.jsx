import { useEffect, useState } from "react";

import axios from "axios";

import { motion } from "framer-motion";

import { Users, ShieldCheck, ShieldX, Mail } from "lucide-react";

function UserList() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `https://capstone-lq6s.onrender.com/admin-api/users/user`,
          {
            withCredentials: true,
          },
        );

        if (res.status === 200) {
          setUsers(res.data.payload);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;

    const confirmMsg = newStatus ? "Activate this user?" : "Block this user?";

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await axios.patch(
        "https://capstone-lq6s.onrender.com/admin-api/users",
        {
          userId,
          isUserActive: newStatus,
        },
        {
          withCredentials: true,
        },
      );

      if (res.status === 201) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId
              ? {
                  ...u,
                  isUserActive: newStatus,
                }
              : u,
          ),
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-medium">{error}</div>
    );
  }

  // EMPTY
  if (users.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">No users found.</div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="overflow-hidden rounded-[28px] border border-white bg-white/80 backdrop-blur-xl shadow-xl"
    >
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-lg">
            <Users size={28} />
          </div>

          <div>
            <h2 className="text-3xl font-bold">Users</h2>

            <p className="opacity-90 text-sm mt-1">Manage all platform users</p>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100 text-gray-700">
            <tr>
              <th className="text-left px-6 py-4 font-semibold">User</th>

              <th className="text-left px-6 py-4 font-semibold">Email</th>

              <th className="text-left px-6 py-4 font-semibold">Status</th>

              <th className="text-center px-6 py-4 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const fullName = `${user.firstName} ${user.lastName}`;

              return (
                <motion.tr
                  key={user._id}
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="border-t border-slate-100 hover:bg-slate-50 transition"
                >
                  {/* USER */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      {user.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {user.firstName?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {fullName}
                        </h3>

                        <p className="text-sm text-gray-400">
                          User ID : {user._id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} />
                      {user.email}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                        user.isUserActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.isUserActive ? (
                        <>
                          <ShieldCheck size={16} />
                          Active
                        </>
                      ) : (
                        <>
                          <ShieldX size={16} />
                          Blocked
                        </>
                      )}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-5 text-center">
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                      }}
                      whileTap={{
                        scale: 0.96,
                      }}
                      onClick={() =>
                        toggleUserStatus(user._id, user.isUserActive)
                      }
                      className={`px-5 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-lg transition ${
                        user.isUserActive
                          ? "bg-gradient-to-r from-red-500 to-pink-500"
                          : "bg-gradient-to-r from-green-500 to-emerald-500"
                      }`}
                    >
                      {user.isUserActive ? "Block" : "Activate"}
                    </motion.button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default UserList;
