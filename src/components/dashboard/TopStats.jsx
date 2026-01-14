import React from "react";
import { CreditCard, TrendingUp, TrendingDown, Activity } from "lucide-react";

const TopStats = ({ dashboardData }) => {
  const totalCredits = dashboardData?.totalSmsCredits || 0;
  const usedCredits = dashboardData?.usedSmsCredits || 0;
  const remainingCredits = dashboardData?.remainingCredits || 0;

  const usagePercentage = totalCredits > 0
    ? ((usedCredits / totalCredits) * 100).toFixed(1)
    : 0;

  const availablePercentage = (100 - parseFloat(usagePercentage)).toFixed(1);

  const isActive = remainingCredits > 0;

  const stats = [
    {
      title: "Total SMS Credits",
      value: totalCredits.toLocaleString(),
      icon: CreditCard,
      bgColor: "bg-gradient-to-br from-teal-500 to-teal-600",
      iconBg: "bg-white/20",
      trend: null,
      textColor: "text-white",
    },
    {
      title: "Used SMS Credits",
      value: usedCredits.toLocaleString(),
      icon: TrendingUp,
      bgColor: "bg-white",
      iconBg: "bg-teal-500/20",
      trend: `${usagePercentage}% used`,
      trendColor: "text-gray-700",
      textColor: "text-black",
    },
    {
      title: "Remaining Credits",
      value: remainingCredits.toLocaleString(),
      icon: TrendingDown,
      bgColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
      iconBg: "bg-white/20",
      trend: `${availablePercentage}% available`,
      trendColor: "text-emerald-100",
      textColor: "text-white",
    },
    {
      title: "Account Status",
      value: isActive ? "Active" : "Depleted",
      icon: Activity,
      bgColor: isActive
        ? "bg-gradient-to-br from-teal-500 to-teal-600"
        : "bg-gradient-to-br from-gray-600 to-gray-700",
      iconBg: isActive ? "bg-white/20" : "bg-white/10",
      trend: dashboardData?.email || "No email",
      trendColor: "text-teal-100",
      statusColor: isActive ? "text-emerald-300" : "text-red-300",
      textColor: "text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={index}
            className={`${stat.bgColor} rounded-2xl p-6 ${stat.textColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/10 flex flex-col justify-between min-h-45`}
          >
            {/* Top Section: Icon + Trend/Status */}
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.iconBg} p-3 rounded-xl backdrop-blur-sm shrink-0`}>
                <Icon 
                  size={24} 
                  className={
                    stat.bgColor.includes("white") 
                      ? "text-teal-600" 
                      : "text-white"
                  } 
                />
              </div>

              <div className="text-right flex-1 ml-4">
                {stat.trend && (
                  <>
                    <span className={`text-xs font-medium ${stat.trendColor} bg-black/10 px-3 py-1.5 rounded-full inline-block`}>
                      {stat.trend}
                    </span>
                    {stat.statusColor && (
                      <p className={`text-lg font-bold mt-2 ${stat.statusColor}`}>
                        {stat.value}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Bottom Section: Title + Value */}
            {!stat.trend && (
              <div className="mt-auto">
                <h3 className="text-sm font-medium opacity-90 mb-2">{stat.title}</h3>
                <p className="text-3xl font-bold tracking-tight">
                  {stat.value}
                </p>
              </div>
            )}

            {stat.trend && !stat.statusColor && (
              <div className="mt-auto">
                <h3 className="text-sm font-medium opacity-90 mb-2">{stat.title}</h3>
                <p className="text-3xl font-bold tracking-tight">
                  {stat.value}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TopStats;