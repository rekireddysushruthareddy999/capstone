import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Clock,
  User,
  MessageCircle,
  Pencil,
  Trash2,
  RotateCcw,
  Send,
} from "lucide-react";

function ArticleByID() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, reset } =
    useForm();

  const user = useAuth(
    (state) => state.currentUser
  );

  const [article, setArticle] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const getArticle = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `http://localhost:2000/user-api/article/${id}`
        );

        setArticle(res.data.payload);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load article"
        );
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString(
      "en-IN",
      {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  // EDIT ARTICLE
  const editArticle = () => {
    navigate("/edit-article", {
      state: article,
    });
  };

  // DELETE / RESTORE ARTICLE
  const toggleArticleStatus = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:2000/author-api/articles/${article._id}`,
        {
          articleId: article._id,
          isArticleActive:
            !article.isArticleActive,
        },
        {
          withCredentials: true,
        }
      );

      setArticle(res.data.payload);

      toast.success(res.data.message);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Operation failed"
      );
    }
  };

  // ADD COMMENT
  const addComment = async (commentObj) => {
    try {
      commentObj.articleId = article._id;

      const res = await axios.put(
        `http://localhost:2000/user-api/articles`,
        commentObj,
        {
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        setArticle(res.data.payload);

        toast.success("Comment added");

        reset();
      }
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  // DELETE COMMENT
  const deleteComment = async (commentId) => {
    try {
      const res = await axios.delete(
        `http://localhost:2000/author-api/articles/${article._id}/comments/${commentId}`,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setArticle(res.data.payload);

        toast.success("Comment deleted");
      }
    } catch (err) {
      toast.error("Failed to delete comment");
    }
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

  // NO ARTICLE
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Article not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-10">
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-white rounded-[32px] shadow-2xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-10 text-white">
          <p className="uppercase tracking-widest text-sm font-semibold opacity-90">
            {article.category}
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 mt-6 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <User size={16} />
              {article.author?.firstName ||
                "Author"}
            </div>

            <div className="flex items-center gap-2">
              <Clock size={16} />
              {formatDate(
                article.createdAt
              )}
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-8 md:p-10">
          <div className="text-gray-700 text-lg leading-8 whitespace-pre-line">
            {article.content}
          </div>

          {/* AUTHOR ACTIONS */}
          {user?.role === "AUTHOR" && (
            <div className="flex gap-4 mt-10">
              <button
                onClick={editArticle}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg hover:scale-105 transition"
              >
                <Pencil size={18} />
                Edit
              </button>

              <button
                onClick={
                  toggleArticleStatus
                }
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition"
              >
                {article.isArticleActive ? (
                  <>
                    <Trash2 size={18} />
                    Delete
                  </>
                ) : (
                  <>
                    <RotateCcw size={18} />
                    Restore
                  </>
                )}
              </button>
            </div>
          )}

          {/* COMMENT FORM */}
          {user?.role === "USER" && (
            <form
              onSubmit={handleSubmit(
                addComment
              )}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-5">
                Add Comment
              </h2>

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Write your comment..."
                  className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-cyan-400"
                  {...register("comment")}
                />

                <button
                  type="submit"
                  className="px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:scale-105 transition"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          )}

          {/* COMMENTS */}
          <div className="mt-14">
            <div className="flex items-center gap-3 mb-8">
              <MessageCircle className="text-blue-600" />

              <h2 className="text-3xl font-bold text-gray-800">
                Comments
              </h2>
            </div>

            {article.comments?.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                No comments yet
              </div>
            ) : (
              <div className="space-y-5">
                {article.comments?.map(
                  (commentObj) => {
                    const name =
                      commentObj.user
                        ?.firstName ||
                      commentObj.user
                        ?.email ||
                      "User";

                    return (
                      <motion.div
                        key={
                          commentObj._id
                        }
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="bg-slate-50 border border-slate-200 rounded-3xl p-5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {commentObj.user
                              ?.profileImageUrl ? (
                              <img
                                src={
                                  commentObj
                                    .user
                                    .profileImageUrl
                                }
                                alt=""
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                                {name
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}

                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {name}
                              </h4>

                              <p className="text-sm text-gray-400">
                                {formatDate(
                                  commentObj.createdAt
                                )}
                              </p>
                            </div>
                          </div>

                          {user?.role ===
                            "AUTHOR" && (
                            <button
                              onClick={() =>
                                deleteComment(
                                  commentObj._id
                                )
                              }
                              className="text-red-500 hover:text-red-600 transition"
                            >
                              <Trash2
                                size={18}
                              />
                            </button>
                          )}
                        </div>

                        <p className="mt-4 text-gray-700 leading-7">
                          {
                            commentObj.comment
                          }
                        </p>
                      </motion.div>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="mt-12 pt-6 border-t border-slate-200 text-sm text-gray-400">
            Last updated :{" "}
            {formatDate(article.updatedAt)}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ArticleByID;