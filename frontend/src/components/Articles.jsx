import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Clock,
  User,
  ArrowRight,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router";

function Articles() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          "http://localhost:2000/user-api/articles"
        );

        setArticles(res.data.payload);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load articles"
        );
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleString(
      "en-IN",
      {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
      }
    );
  };

  const openArticle = (article) => {
    navigate(`/article/${article._id}`, {
      state: article,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
              <FileText size={22} />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Latest Articles
              </h1>

              <p className="text-gray-500 mt-1">
                Discover trending stories and insights
              </p>
            </div>
          </div>
        </motion.div>

        {/* NO ARTICLES */}
        {articles.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white shadow-xl p-12 text-center text-gray-400">
            No articles found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {articles.map((article) => (
              <motion.div
                key={article._id}
                whileHover={{
                  y: -6,
                }}
                className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-xl overflow-hidden"
              >
                {/* TOP */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
                  <p className="uppercase text-xs tracking-widest opacity-90">
                    {article.category}
                  </p>

                  <h2 className="text-2xl font-bold mt-3 line-clamp-2">
                    {article.title}
                  </h2>
                </div>

                {/* BODY */}
                <div className="p-6">
                  <p className="text-gray-600 leading-7 line-clamp-4">
                    {article.content}
                  </p>

                  <div className="mt-6 space-y-3">
                    
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <User size={16} />
                      {article.author
                        ?.firstName || "Author"}
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Clock size={16} />
                      {formatDate(
                        article.createdAt
                      )}
                    </div>
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() =>
                      openArticle(article)
                    }
                    className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
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

export default Articles;