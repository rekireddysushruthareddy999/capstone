import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { motion } from "framer-motion";
import { FileText, Clock, ArrowRight, Eye, Trash2 } from "lucide-react";

function AuthorArticles() {
  const navigate = useNavigate();

  const user = useAuth((state) => state.currentUser);

  const [articles, setArticles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const getAuthorArticles = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          "https://capstone-lq6s.onrender.com/author-api/articles",
          {
            withCredentials: true,
          },
        );

        if (res.status === 200) {
          setArticles(res.data.payload);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load articles");
      } finally {
        setLoading(false);
      }
    };

    getAuthorArticles();
  }, [user]);

  const openArticle = (article) => {
    navigate(`/article/${article._id}`, {
      state: article,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
    });
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="w-12 h-12 border-4 border-cyan-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  // EMPTY
  if (articles.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-xl mb-6">
          <FileText size={34} />
        </div>

        <h2 className="text-3xl font-bold text-gray-800">No Articles Yet</h2>

        <p className="text-gray-500 mt-3 max-w-md">
          You haven’t published any articles yet. Start writing and share your
          ideas with the world.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {articles.map((article) => (
        <motion.div
          key={article._id}
          whileHover={{
            y: -6,
          }}
          className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-xl overflow-hidden flex flex-col"
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white relative">
            {/* STATUS */}
            <div
              className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                article.isArticleActive
                  ? "bg-green-500/20 text-green-100 border border-green-200/20"
                  : "bg-red-500/20 text-red-100 border border-red-200/20"
              }`}
            >
              {article.isArticleActive ? "ACTIVE" : "DELETED"}
            </div>

            <p className="uppercase text-xs tracking-widest opacity-90">
              {article.category}
            </p>

            <h2 className="text-2xl font-bold mt-4 line-clamp-2">
              {article.title}
            </h2>
          </div>

          {/* BODY */}
          <div className="p-6 flex flex-col flex-1">
            <p className="text-gray-600 leading-7 line-clamp-4">
              {article.content}
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
              <Clock size={16} />

              {formatDate(article.createdAt)}
            </div>

            {/* BUTTON */}
            <button
              onClick={() => openArticle(article)}
              className="mt-6 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
            >
              <Eye size={18} />
              Read Article
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default AuthorArticles;
