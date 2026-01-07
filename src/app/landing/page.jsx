"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Send,
  Users,
  BarChart3,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const Landing = () => {
  const router = useRouter();

  const features = [
    {
      icon: Send,

      
      title: "Bulk SMS",
      description:
        "Send thousands of messages instantly to your customers with our powerful bulk SMS platform.",
    },
    {
      icon: Users,
      title: "Contact Management",
      description:
        "Organize your contacts into groups for targeted messaging campaigns.",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description:
        "Track delivery rates, engagement metrics, and campaign performance in real-time.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with 99.9% uptime guarantee for your business communications.",
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      description:
        "Lightning-fast message delivery with optimized routing across all networks.",
    },
    {
      icon: CheckCircle,
      title: "Delivery Reports",
      description:
        "Get detailed delivery reports and status updates for every message sent.",
    },
  ];

  const stats = [
    { value: "99.9%", label: "Delivery Rate" },
    { value: "10M+", label: "Messages Sent" },
    { value: "5K+", label: "Happy Clients" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              {/* <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div> */}
              <span className="text-xl sm:text-2xl font-bold text-white">
                kritim<span className="text-teal-400">SMS</span>
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
         <Button
                onClick={() => router.push("/login")}
                className="bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold  sm:px-6 py-4 rounded-lg shadow-lg shadow-teal-500/30 cursor-pointer"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>


      <section className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-teal-400" />
            <span className="text-teal-400 text-sm font-medium">
              Trusted by 5,000+ businesses
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-8">
            Powerful SMS Platform for{" "}
            <span className="bg-linear-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Modern Business
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            Send bulk SMS, manage contacts, and track delivery — all from one
            intuitive dashboard.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => router.push("/login")}
              className="bg-linear-to-r from-teal-500 to-teal-600 text-white font-bold px-10 py-7 rounded-xl text-lg shadow-xl hover:scale-105 cursor-pointer"
            >
              Get Started 
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            {/* <Button
              variant="outline"
              className="text-white bg-white/10 px-8 py-6 rounded-xl text-lg">
              Watch Demo
            </Button> */}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 border-y border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold bg-linear-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Comprehensive SMS solutions to grow your business.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-teal-500/50 transition"
              >
                <div className="w-14 h-14 bg-teal-500/20 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-slate-400">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>
   <footer className="py-10 border-t border-white/10 text-center text-slate-500">
        © 2024 KritimSMS. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;