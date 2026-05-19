import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import UserList from "./UserList";
import AuthorList from "./AuthorList";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  PenSquare,
  ArrowRight,
  Clock,
} from "lucide-react";

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
        className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
      />
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2 rounded-xl transition ${
        active
          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
          : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

function ArticleCard({ articleObj, onRead, formatDate }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
        scale: 1.01,
      }}
      transition={{ duration: 0.3 }}
      onClick={() => onRead(articleObj)}
      className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-lg p-6 cursor-pointer"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-3">
        {articleObj.title}
      </h2>

      <p className="text-gray-500 leading-7 line-clamp-3">
        {articleObj.content.slice(0, 130)}...
      </p>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock size={14} />
          <span>{formatDate(articleObj.createdAt)}</span>
        </div>

        <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
          <span>Read More</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </motion.article>
  );
}

function Home() {
  const currentUser = useAuth((state) => state.currentUser);

  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);

  const navigate = useNavigate();

  const isAdmin =
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "admin";

  useEffect(() => {
    if (isAdmin) return;

    const getArticles = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          "http://localhost:2000/user-api/articles",
          { withCredentials: true }
        );

        if (res.status === 200) {
          setArticles(res.data.payload ?? []);
        }
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, [currentUser]);

  const formatDateIST = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const navigateToArticleByID = (articleObj) => {
    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <p className="text-red-500 text-lg">
          {error}
        </p>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-xl p-8 mb-6">
            <h1 className="text-4xl font-bold text-gray-800">
              Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Manage users and authors
            </p>
          </div>

          <div className="flex gap-3 mb-6">
            <TabBtn
              active={activeTab === "users"}
              onClick={() => setActiveTab("users")}
              icon={Users}
              label="Users"
            />

            <TabBtn
              active={activeTab === "authors"}
              onClick={() => setActiveTab("authors")}
              icon={PenSquare}
              label="Authors"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-xl p-6"
            >
              {activeTab === "users" ? (
                <UserList />
              ) : (
                <AuthorList />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-800 leading-tight">
            Discover Amazing
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Articles
            </span>
          </h1>

          <p className="text-gray-500 mt-4 max-w-lg">
            Explore trending stories and insights from writers around the platform.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-gray-400 text-lg">
              No Articles Found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((articleObj) => (
              <ArticleCard
                key={articleObj._id}
                articleObj={articleObj}
                onRead={navigateToArticleByID}
                formatDate={formatDateIST}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Home;