import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ShieldX,
  Mail,
  User,
} from "lucide-react";

function AuthorList() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getAuthors = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          "http://localhost:2000/admin-api/users/author",
          {
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          setAuthors(res.data.payload);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch authors"
        );
      } finally {
        setLoading(false);
      }
    };

    getAuthors();
  }, []);

  const toggleAuthorStatus = async (
    authorId,
    currentStatus
  ) => {
    const newStatus = !currentStatus;

    try {
      const res = await axios.patch(
        "http://localhost:2000/admin-api/users",
        {
          userId: authorId,
          isUserActive: newStatus,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        setAuthors((prev) =>
          prev.map((author) =>
            author._id === authorId
              ? {
                  ...author,
                  isUserActive: newStatus,
                }
              : author
          )
        );
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 font-medium">
        {error}
      </p>
    );
  }

  if (authors.length === 0) {
    return (
      <p className="text-center text-gray-400 py-10">
        No authors found
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {authors.map((author) => (
        <motion.div
          key={author._id}
          whileHover={{ y: -4 }}
          className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-lg p-6"
        >
          {/* Top */}
          <div className="flex items-start justify-between">
            
            <div className="flex items-center gap-4">
              
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {author.firstName?.charAt(0)}
              </div>

              {/* Info */}
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {author.firstName} {author.lastName}
                </h2>

                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Mail size={14} />
                  {author.email}
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              {author.isUserActive ? (
                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <ShieldCheck size={15} />
                  Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-500 text-sm font-medium">
                  <ShieldX size={15} />
                  Blocked
                </span>
              )}
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() =>
                toggleAuthorStatus(
                  author._id,
                  author.isUserActive
                )
              }
              className={`px-5 py-2.5 rounded-2xl text-sm font-medium text-white shadow-lg transition hover:scale-105 ${
                author.isUserActive
                  ? "bg-gradient-to-r from-red-500 to-pink-500"
                  : "bg-gradient-to-r from-green-500 to-emerald-500"
              }`}
            >
              {author.isUserActive
                ? "Block Author"
                : "Activate Author"}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default AuthorList;