"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Footer from "@/components/shared/footer";
import { MessageSquare, Zap, Shield, TrendingUp } from "lucide-react";
import Header from "@/components/Header";

const Landing = () => {
  const router = useRouter();

  const scrollToStats = () => {
    const statsSection = document.getElementById("stats-section");
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const stats = [
    { value: "99.9%", label: "Delivery Rate" },
    { value: "10M+", label: "Messages Sent" },
    { value: "5K+", label: "Happy Clients" },
    { value: "24/7", label: "Support" },
  ];

  const features = [
    { icon: MessageSquare, color: "from-blue-400 to-cyan-500" },
    { icon: Zap, color: "from-yellow-400 to-orange-500" },
    { icon: Shield, color: "from-green-400 to-emerald-500" },
    { icon: TrendingUp, color: "from-purple-400 to-pink-500" },
  ];

  // Ultra-smooth phone floating animation
  const phoneFloat = {
    initial: { y: 0, rotateY: 0, rotateX: 0 },
    animate: {
      y: [-20, 20, -20],
      rotateY: [-8, 8, -8],
      rotateX: [-3, 3, -3],
      transition: {
        y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        rotateX: { duration: 7, repeat: Infinity, ease: "easeInOut" },
      },
    },
  };

  // Card animations with parallax effect
  const cardFloat1 = {
    initial: { y: 0, x: 0, rotate: -12, scale: 0.95 },
    animate: {
      y: [-15, 15, -15],
      x: [-5, 5, -5],
      rotate: [-12, -8, -12],
      scale: [0.95, 1.05, 0.95],
      transition: {
        y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        x: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      },
    },
  };

  const cardFloat2 = {
    initial: { y: 0, x: 0, rotate: 8, scale: 0.95 },
    animate: {
      y: [-18, 18, -18],
      x: [5, -5, 5],
      rotate: [8, 12, 8],
      scale: [0.95, 1.03, 0.95],
      transition: {
        y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
        x: { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
        rotate: { duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
        scale: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
      },
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-teal-50 overflow-hidden">
      <Header />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 lg:pt-20 pb-16 relative">
    
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-linear-to-r from-teal-400 to-sky-400 rounded-full opacity-20"
              initial={{
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
              }}
              animate={{
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10 flex-col-reverse lg:flex-row">
          {/* Left: Text & Buttons */}
          <div className="space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <span className="px-4 py-2 bg-linear-to-r from-teal-100 to-sky-100 text-teal-700 rounded-full text-sm font-semibold border border-teal-200">
                Trusted by 5,000+ businesses
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight"
            >
              Digital SMS service that{" "}
              <motion.span
                className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-teal-500 to-emerald-500"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                just works
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-slate-600 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              KritimSMS provides one-stop solutions for all your bulk SMS needs.
              Fast, reliable, and scalable messaging for modern businesses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => router.push("/login")}
                  className="bg-linear-to-r from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-600 hover:via-teal-700 hover:to-emerald-700 text-white font-semibold px-8 py-6 rounded-full shadow-lg text-base transition-all duration-300 hover:shadow-2xl cursor-pointer relative overflow-hidden group w-full sm:w-auto"
                >
                  <span className="relative z-10">Get Started</span>
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={scrollToStats}
                  className="border-2 border-teal-500 text-teal-600 hover:bg-teal-50 font-semibold px-8 py-6 rounded-full bg-white/80 backdrop-blur-sm text-base transition-all duration-300 hover:shadow-lg cursor-pointer w-full sm:w-auto"
                >
                  Know More
                </Button>
              </motion.div>
            </motion.div>

            {/* Feature icons - clickable to login */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4 justify-center lg:justify-start pt-4"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.8 + i * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{
                    scale: 1.2,
                    rotate: 360,
                    transition: { duration: 0.6 },
                  }}
                  onClick={() => router.push("/login")}
                  className={`w-12 h-12 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center shadow-lg cursor-pointer transition-transform`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Images Display */}
          <div className="relative flex justify-center items-center min-h-96 mt-12 lg:mt-0">
            {/* Background blobs */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 120, 0],
                borderRadius: [
                  "30% 70% 70% 30% / 30% 30% 70% 70%",
                  "70% 30% 30% 70% / 70% 70% 30% 30%",
                  "30% 70% 70% 30% / 30% 30% 70% 70%",
                ],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-linear-to-br from-teal-200 to-sky-300 opacity-30 blur-3xl"
            />

            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [120, 0, 120],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-linear-to-br from-emerald-200 to-teal-300 opacity-30 blur-3xl"
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-xs sm:max-w-sm lg:max-w-md">
              {/* Center phone mockup */}
              <motion.div
                variants={phoneFloat}
                initial="initial"
                animate="animate"
                className="col-span-1 flex flex-col items-center order-1"
                whileHover={{ scale: 1.08, transition: { type: "spring", stiffness: 300 } }}
                style={{ perspective: 1000 }}
              >
                <div className="relative w-48 sm:w-64 lg:w-72 xl:w-96 transform-gpu">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-linear-to-r from-teal-400 via-sky-400 to-emerald-400 rounded-[2.5rem] sm:rounded-[3rem] blur-2xl opacity-60"
                  />

                  <div className="relative bg-linear-to-br from-slate-800 to-slate-900 rounded-[2.5rem] sm:rounded-[3rem] p-2 sm:p-3 shadow-2xl">
                    <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden aspect-9/19 relative">
                      <motion.div
                        animate={{
                          background: [
                            "linear-gradient(0deg, #06b6d4 0%, #14b8a6 100%)",
                            "linear-gradient(120deg, #14b8a6 0%, #10b981 100%)",
                            "linear-gradient(240deg, #10b981 0%, #06b6d4 100%)",
                            "linear-gradient(360deg, #06b6d4 0%, #14b8a6 100%)",
                          ],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0"
                      />

                      <div className="relative z-10 p-4 sm:p-6 space-y-3 sm:space-y-4 pt-8 sm:pt-12">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: i * 0.8,
                              duration: 0.5,
                              repeat: Infinity,
                              repeatDelay: 2.4,
                            }}
                            className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-lg"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-teal-400 to-sky-500" />
                              <div className="h-3 bg-slate-200 rounded w-16 sm:w-20" />
                            </div>
                            <div className="space-y-2">
                              <div className="h-2 bg-slate-100 rounded w-full" />
                              <div className="h-2 bg-slate-100 rounded w-4/5" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-5 sm:h-6 bg-slate-900 rounded-full z-20" />
                  </div>
                </div>
              </motion.div>

              {/* Floating cards - hidden on very small screens */}
              <div className="hidden sm:flex flex-col space-y-6 lg:space-y-8 justify-center order-2">
                <motion.div
                  variants={cardFloat1}
                  initial="initial"
                  animate="animate"
                  whileHover={{ scale: 1.15, rotate: 0, z: 50, transition: { duration: 0.3 } }}
                  className="relative cursor-pointer"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -inset-3 sm:-inset-4 bg-linear-to-br from-teal-400 via-sky-400 to-emerald-400 rounded-3xl blur-2xl"
                  />
                  <Image
                    src="/Bhuban.png"
                    alt="SMS message example"
                    width={320}
                    height={480}
                    className="relative rounded-2xl shadow-2xl object-cover border-4 border-white w-44 sm:w-52 lg:w-60 transform-gpu"
                  />
                  <motion.div
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent rounded-2xl"
                    style={{ transform: "skewX(-20deg)" }}
                  />
                </motion.div>

                <motion.div
                  variants={cardFloat2}
                  initial="initial"
                  animate="animate"
                  whileHover={{ scale: 1.15, rotate: 0, z: 50, transition: { duration: 0.3 } }}
                  className="relative ml-8 sm:ml-12 cursor-pointer"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    className="absolute -inset-3 sm:-inset-4 bg-linear-to-br from-sky-400 via-emerald-400 to-teal-400 rounded-3xl blur-2xl"
                  />
                  <Image
                    src="/Bhuban.png"
                    alt="Bulk SMS notification"
                    width={300}
                    height={460}
                    className="relative rounded-2xl shadow-2xl object-cover border-4 border-white w-40 sm:w-48 lg:w-56 transform-gpu"
                  />
                  <motion.div
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, delay: 1 }}
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent rounded-2xl"
                    style={{ transform: "skewX(-20deg)" }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          id="stats-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 lg:mt-24 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 border border-sky-100 relative overflow-hidden"
        >
          <motion.div
            animate={{
              background: [
                "radial-gradient(circle at 0% 0%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 0% 100%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 0%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute inset-0 pointer-events-none"
          />

          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                Create memorable experiences at scale with our world-class
                technology and remarkable service.
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center md:justify-end gap-6 lg:gap-10">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 150,
                  }}
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -10, 10, -10, 0],
                    transition: { duration: 0.5 },
                  }}
                  viewport={{ once: true }}
                  className="text-center group cursor-pointer"
                >
                  <motion.div
                    className="w-24 h-24 bg-gradient-to-br from-sky-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border-2 border-sky-200 shadow-lg relative overflow-hidden"
                    whileHover={{ borderColor: "#14b8a6" }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-sky-400/20"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 2, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-600 relative z-10">
                      {stat.value}
                    </span>
                  </motion.div>
                  <p className="text-slate-600 font-medium text-sm group-hover:text-teal-600 transition-colors">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;