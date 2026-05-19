import Header from "./Header";
import Footer from "./Footer";

import { Outlet } from "react-router";

import { useEffect } from "react";

import { useAuth } from "../store/authStore";

import { motion } from "framer-motion";

function RootLayout() {
  const checkAuth = useAuth(
    (state) => state.checkAuth
  );

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 overflow-hidden relative">
      
      {/* BACKGROUND BLOBS */}
      <div className="fixed top-[-120px] left-[-120px] w-[350px] h-[350px] bg-blue-300/30 blur-3xl rounded-full -z-10"></div>

      <div className="fixed bottom-[-150px] right-[-120px] w-[400px] h-[400px] bg-cyan-300/20 blur-3xl rounded-full -z-10"></div>

      <div className="fixed top-[40%] left-[45%] w-[250px] h-[250px] bg-sky-200/20 blur-3xl rounded-full -z-10"></div>

      {/* HEADER */}
      <Header />

      {/* MAIN */}
      <main className="flex-1 relative">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default RootLayout;