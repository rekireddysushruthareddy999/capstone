import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

import { useEffect } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { motion } from "framer-motion";

import { FilePenLine, Layers, Type, AlignLeft, Save } from "lucide-react";

function EditArticle() {
  const location = useLocation();

  const navigate = useNavigate();

  const article = location.state;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Prefill form
  useEffect(() => {
    if (!article) return;

    setValue("title", article.title);

    setValue("category", article.category);

    setValue("content", article.content);
  }, [article]);

  const updateArticle = async (modifiedArticle) => {
    try {
      modifiedArticle.articleId = article._id;

      const res = await axios.put(
        "https://capstone-lq6s.onrender.com/author-api/articles",
        modifiedArticle,
        {
          withCredentials: true,
        },
      );

      if (res.status === 200) {
        toast.success("Article updated successfully");

        navigate(`/article/${article._id}`, {
          state: res.data.payload,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update article");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl border border-white rounded-[32px] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <FilePenLine size={26} />

            <h1 className="text-4xl font-bold">Edit Article</h1>
          </div>

          <p className="text-blue-100">
            Update your article details and publish changes instantly.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(updateArticle)}
          className="p-8 md:p-10 space-y-8"
        >
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
              <Type size={18} />
              Article Title
            </label>

            <input
              type="text"
              placeholder="Enter article title"
              className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-400"
              {...register("title", {
                required: "Title is required",
              })}
            />

            {errors.title && (
              <p className="text-red-500 text-sm mt-2">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
              <Layers size={18} />
              Category
            </label>

            <select
              className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-400"
              {...register("category", {
                required: "Category is required",
              })}
            >
              <option value="">Select category</option>

              <option value="technology">Technology</option>

              <option value="programming">Programming</option>

              <option value="ai">AI</option>

              <option value="web-development">Web Development</option>
            </select>

            {errors.category && (
              <p className="text-red-500 text-sm mt-2">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
              <AlignLeft size={18} />
              Content
            </label>

            <textarea
              rows="14"
              placeholder="Write your article content..."
              className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 outline-none resize-none focus:ring-2 focus:ring-blue-400"
              {...register("content", {
                required: "Content is required",
              })}
            />

            {errors.content && (
              <p className="text-red-500 text-sm mt-2">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl font-semibold shadow-lg"
          >
            <Save size={20} />
            Update Article
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default EditArticle;
