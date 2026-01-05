"use client"

import React from "react";
import { MessageSquare, Send, Users, BarChart3, Shield, Zap, CheckCircle, ArrowRight } from "lucide-react";


const Landing = () => {


  const features = [
    {
      icon: Send,
      title: "Bulk SMS",
      description: "Send thousands of messages instantly to your customers with our powerful bulk SMS platform."
    },
    {
      icon: Users,
      title: "Contact Management",
      description: "Organize your contacts into groups for targeted messaging campaigns."
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track delivery rates, engagement metrics, and campaign performance in real-time."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee for your business communications."
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "Lightning-fast message delivery with optimized routing across all networks."
    },
    {
      icon: CheckCircle,
      title: "Delivery Reports",
      description: "Get detailed delivery reports and status updates for every message sent."
    }
  ];

  const stats = [
    { value: "99.9%", label: "Delivery Rate" },
    { value: "10M+", label: "Messages Sent" },
    { value: "5K+", label: "Happy Clients" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white">SMS<span className="text-teal-400">Hub</span></span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10 hidden sm:inline-flex"
                onClick={() => navigate("/dashboard")}
              >
                Features
              </Button>
              <Button
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10 hidden sm:inline-flex"
              >
                Pricing
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-4 sm:px-6 py-2 rounded-xl shadow-lg shadow-teal-500/30 transition-all duration-300 hover:shadow-teal-500/50"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-2 mb-6 sm:mb-8">
              <Zap className="w-4 h-4 text-teal-400" />
              <span className="text-teal-400 text-sm font-medium">Trusted by 5,000+ businesses</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 sm:mb-8">
              Powerful SMS Platform for{" "}
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Modern Business
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
              Send bulk SMS, manage contacts, and track delivery - all from one intuitive dashboard.
              Reach your customers instantly with our reliable messaging platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold px-8 py-6 rounded-xl text-lg shadow-xl shadow-teal-500/30 transition-all duration-300 hover:shadow-teal-500/50 hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-xl text-lg"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-y border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Everything You Need
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Comprehensive SMS solutions to grow your business and engage customers effectively.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-6 sm:p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-teal-500/20 to-teal-600/20 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:from-teal-500/30 group-hover:to-teal-600/30 transition-all">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-teal-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of businesses using SMSHub to connect with their customers. Start your free trial today.
              </p>
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-white text-teal-600 hover:bg-teal-50 font-bold px-8 py-6 rounded-xl text-lg shadow-xl transition-all duration-300 hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">SMS<span className="text-teal-400">Hub</span></span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2024 SMSHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;