"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";

const Landing = () => {
  const router = useRouter();

  const stats = [
    { value: "99.9%", label: "Delivery Rate" },
    { value: "10M+", label: "Messages Sent" },
    { value: "5K+", label: "Happy Clients" },
  ];

  const floatVariants = {
    animate: {
      y: [-20, 20, -20],
      rotate: [-5, 5, -5],
      transition: {
        y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
      },
    },
  };

  const delayedFloat = {
    animate: {
      ...floatVariants.animate,
      transition: { ...floatVariants.animate.transition, delay: 1 },
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-sky-100">
      <Header />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 lg:pt-20 pb-16">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text & Buttons */}
          <div className="space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight"
            >
              Digital SMS service that{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-teal-500">
                just works
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-600 text-lg max-w-lg"
            >
              KritimSMS provides one-stop solutions for all your bulk SMS needs.
              Fast, reliable, and scalable messaging for modern businesses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                onClick={() => router.push("/login")}
                className="bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-8 py-6 rounded-full shadow-lg text-base transition-all duration-300 hover:scale-105 cursor-pointer "
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                className="border-2 border-teal-500 text-teal-600 hover:bg-teal-50 font-semibold px-8 py-6 rounded-full bg-white text-base transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                Know More
              </Button>
            </motion.div>
          </div>

          <div className="relative flex justify-center items-center min-h-96">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-96 h-96 bg-linear-to-br from-sky-100 to-sky-200 rounded-full opacity-60 blur-3xl"
            />

            <div className="relative z-10 grid grid-cols-2 gap-8 max-w-md">
              <motion.div
                variants={floatVariants}
                initial="initial"
                animate="animate"
                className="col-span-1 flex flex-col items-center"
              >
                <div className="relative w-72 lg:w-96">
                  <video
                    src="/video.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover rounded-[3rem] scale-[1.08] translate-y-1"
                  />
                  <Image
                    src="/iphone-frame.png"
                  
                    width={800}
                    height={800}
                    className="relative z-10 pointer-events-none"
                    priority
                  />
                </div>
              </motion.div>

              <div className="col-span-1 space-y-8 flex flex-col justify-center">
                <motion.div
                  variants={delayedFloat}
                  initial="initial"
                  animate="animate"
                  className="relative -rotate-12"
                >
                  <Image
                    src="/Bhuban.png"
                    alt="SMS message example"
                    width={200}
                    height={300}
                    className="rounded-2xl shadow-xl object-cover hover:scale-110 transition-transform duration-500"
                  />
                </motion.div>

                <motion.div
                  variants={{ ...delayedFloat, animate: { ...delayedFloat.animate, transition: { ...delayedFloat.animate.transition, delay: 2 } } }}
                  initial="initial"
                  animate="animate"
                  className="relative rotate-6 ml-12"
                >
                  <Image
                    src="/Bhuban.png"
                    alt="Bulk SMS notification"
                    width={180}
                    height={280}
                    className="rounded-2xl shadow-xl object-cover hover:scale-110 transition-transform duration-500"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 lg:mt-24 bg-white rounded-3xl shadow-xl p-8 lg:p-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-slate-700 text-lg leading-relaxed">
                Create memorable experiences at scale with our world-class
                technology and remarkable service.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 lg:gap-10">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.15 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 bg-linear-to-br from-sky-50 to-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-sky-200 shadow-md">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-sky-500 to-teal-500">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium text-sm">{stat.label}</p>
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