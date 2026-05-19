import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOut, BookOpen, Clock, ArrowRight } from "lucide-react";

function UserProfile() {
  const logout = useAuth((state) => state.logout);

  const currentUser = useAuth((state) => state.currentUser);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const getArticles = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `https://capstone-lq6s.onrender.com/user-api/articles`,
          {
            withCredentials: true,
          },
        );

        if (res.status === 200) {
          setArticles(res.data.payload);
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const onLogout = async () => {
    await logout();

    toast.success("Logout Successful");

    navigate("/login");
  };

  const openArticle = (articleObj) => {
    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* PROFILE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] shadow-2xl p-8 mb-10"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* LEFT */}
            <div className="flex items-center gap-5">
              {currentUser?.profileImageUrl ? (
                <img
                  src={currentUser.profileImageUrl}
                  alt="profile"
                  className="w-20 h-20 rounded-3xl object-cover shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                  {currentUser?.firstName?.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Welcome back
                </p>

                <h1 className="text-4xl font-bold text-gray-800 mt-1">
                  {currentUser?.firstName}
                </h1>

                <p className="text-gray-500 mt-2">
                  Explore latest articles from authors
                </p>
              </div>
            </div>

            {/* LOGOUT */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onLogout}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
            >
              <LogOut size={18} />
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 px-5 py-4 rounded-2xl mb-6">
            {error}
          </div>
        )}

        {/* HEADING */}
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="text-blue-600" />

          <h2 className="text-3xl font-bold text-gray-800">Latest Articles</h2>
        </div>

        {/* EMPTY */}
        {articles.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 text-center text-gray-500 shadow-lg">
            No articles available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <motion.div
                key={article._id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                whileHover={{
                  y: -6,
                }}
                className="bg-white/80 backdrop-blur-xl border border-white rounded-[28px] shadow-xl overflow-hidden flex flex-col"
              >
                {/* TOP */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
                  <p className="uppercase text-xs tracking-widest font-semibold opacity-90">
                    {article.category}
                  </p>

                  <h3 className="text-2xl font-bold mt-3 line-clamp-2">
                    {article.title}
                  </h3>
                </div>

                {/* BODY */}
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-gray-600 leading-7 line-clamp-4">
                    {article.content}
                  </p>

                  <div className="mt-6 space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <BookOpen size={15} />

                      <span>{article.author?.firstName || "Author"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={15} />

                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() => openArticle(article)}
                    className="mt-8 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition-all duration-300"
                  >
                    Read Article
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
