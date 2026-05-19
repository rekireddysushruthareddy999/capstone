import { useEffect } from "react";

import {
  useNavigate,
  useLocation,
} from "react-router";

import { motion } from "framer-motion";

import {
  ShieldX,
  ArrowLeft,
  Lock,
} from "lucide-react";

function Unauthorized({
  delay = 5000,
}) {
  const navigate = useNavigate();

  const location = useLocation();

  const redirectTo =
    location.state?.redirectTo ||
    "/login";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectTo, {
        replace: true,
      });
    }, delay);

    return () =>
      clearTimeout(timer);
  }, [
    navigate,
    redirectTo,
    delay,
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 px-4">
      
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.4,
        }}
        className="w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white rounded-[32px] shadow-2xl overflow-hidden"
      >
        
        {/* TOP */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-10 text-white text-center">
          
          <motion.div
            animate={{
              rotate: [0, -6, 6, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="w-24 h-24 mx-auto rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-lg shadow-xl"
          >
            <ShieldX size={48} />
          </motion.div>

          <h1 className="text-5xl font-bold mt-6">
            403
          </h1>

          <p className="text-xl mt-2 font-medium">
            Unauthorized Access
          </p>
        </div>

        {/* CONTENT */}
        <div className="p-8 text-center">
          
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
              <Lock className="text-red-500" />
            </div>
          </div>

          <p className="text-gray-700 text-lg leading-8">
            You don’t have permission
            to access this page.
          </p>

          <p className="text-sm text-gray-400 mt-4">
            Redirecting in{" "}
            {delay / 1000} seconds...
          </p>

          <button
            onClick={() =>
              navigate(redirectTo)
            }
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            <ArrowLeft size={18} />
            Go Now
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Unauthorized;