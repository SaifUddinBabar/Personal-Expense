import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: { trigger: heroRef.current, start: "top 80%" },
      }
    );
  }, []);

  return (
    <section
      ref={heroRef}
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 relative overflow-hidden bg-gray-900 text-white"
    >
      <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-pink-500/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse"></div>

      <motion.h1
        className="text-5xl md:text-6xl font-extrabold text-white leading-snug mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Manage Your{" "}
        <motion.span
          className="text-teal-400"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          Money
        </motion.span>{" "}
        Wisely 💸
      </motion.h1>

      <p className="text-gray-400 text-lg max-w-2xl mb-8">
        Take full control of your income and expenses — track, plan, and achieve
        your financial goals with FinEase.
      </p>

      <div className="flex gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/register">
            <button className="bg-teal-500 text-white px-6 py-3 rounded-full font-semibold shadow-xl shadow-teal-500/30 hover:bg-teal-600 transition">
              Get Started
            </button>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/dashboard">
            <button className="border border-teal-500 text-teal-400 px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition">
              View Dashboard
            </button>
          </Link>
        </motion.div>
      </div>
<motion.img
  src="https://cdn-icons-png.flaticon.com/512/4010/4010773.png"
  alt="Money Management Logo"
  className="w-72 mt-16 filter brightness-0 invert drop-shadow-[0_8px_10px_rgba(0,0,0,0.4)]"
  initial={{ y: 20 }}
  animate={{ y: -20 }}
  transition={{ y: { repeat: Infinity, repeatType: 'reverse', duration: 2 } }}
/>



    </section>
  );
};

export default Hero;
