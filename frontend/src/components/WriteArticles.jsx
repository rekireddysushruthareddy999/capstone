import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { PenSquare, Layers3, FileText, Send } from "lucide-react";

import { useAuth } from "../store/authStore";

function WriteArticles() {
  const navigate = useNavigate();

  const currentUser = useAuth((state) => state.currentUser);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitArticle = async (articleObj) => {
    try {
      setLoading(true);

      articleObj.author = currentUser._id;

      const res = await axios.post(
        `https://capstone-lq6s.onrender.com/author-api/articles`,
        articleObj,
        {
          withCredentials: true,
        },
      );

      if (res.status === 201) {
        toast.success("Article published successfully");

        navigate("/author-profile/articles");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to publish article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 px-4 py-10">
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white overflow-hidden"
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-10 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-lg">
              <PenSquare size={30} />
            </div>

            <div>
              <p className="uppercase tracking-[0.3em] text-sm opacity-90">
                Author Panel
              </p>

              <h1 className="text-4xl font-bold mt-2">Write New Article</h1>

              <p className="mt-2 opacity-90">Share your ideas with the world</p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit(submitArticle)} className="space-y-8">
            {/* TITLE */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                <PenSquare size={18} className="text-blue-600" />
                Article Title
              </label>

              <input
                type="text"
                placeholder="Enter article title"
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 5,
                    message: "Title must be at least 5 characters",
                  },
                })}
              />

              {errors.title && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* CATEGORY */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                <Layers3 size={18} className="text-blue-600" />
                Category
              </label>

              <select
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                {...register("category", {
                  required: "Category is required",
                })}
              >
                <option value="">Select category</option>

                <option value="technology">Technology</option>

                <option value="programming">Programming</option>

                <option value="ai">AI</option>

                <option value="web-development">Web Development</option>

                <option value="philosophy">Philosophy</option>

                <option value="thrillers">Thrillers</option>
              </select>

              {errors.category && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* CONTENT */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                <FileText size={18} className="text-blue-600" />
                Content
              </label>

              <textarea
                rows="12"
                placeholder="Write your article content..."
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 resize-none leading-7"
                {...register("content", {
                  required: "Content is required",
                  minLength: {
                    value: 50,
                    message: "Content must be at least 50 characters",
                  },
                })}
              />

              {errors.content && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.content.message}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              disabled={loading}
              type="submit"
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg disabled:opacity-70"
            >
              <Send size={18} />

              {loading ? "Publishing..." : "Publish Article"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default WriteArticles;
