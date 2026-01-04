import {useMemo, useState, useCallback} from "react";
import {motion} from "framer-motion";
import KPICard from "../analytics/KPICard";
import GameAnalytics from "../analytics/GameAnalytics";
import CategoryChart from "../analytics/CategoryChart";
import ConversionFunnel from "../analytics/ConversionFunnel";
import CategoryGameFilter from "../analytics/CategoryGameFilter";

const WomenTournamentAnalytics = ({
  registrations,
  statistics,
  onFilterChange,
}) => {
  const [categoryGameFilter, setCategoryGameFilter] = useState({
    category: "all",
    games: [],
  });

  // Filter registrations based on category and game selection
  const filteredRegistrations = useMemo(() => {
    if (!registrations) return [];

    let filtered = [...registrations];

    // Filter by category
    if (categoryGameFilter.category !== "all") {
      filtered = filtered.filter(
        (r) => r.selectedCategory === categoryGameFilter.category
      );
    }

    // Filter by selected games
    if (categoryGameFilter.games.length > 0) {
      filtered = filtered.filter((r) =>
        r.selectedSports?.some((sport) =>
          categoryGameFilter.games.includes(sport)
        )
      );
    }

    return filtered;
  }, [registrations, categoryGameFilter]);

  const handleCategoryGameFilterChange = useCallback((filter) => {
    setCategoryGameFilter(filter);
  }, []);

  // Calculate KPI data from filtered registrations
  const kpis = useMemo(() => {
    const total = filteredRegistrations?.length || 0;
    const confirmed =
      filteredRegistrations?.filter((r) => r.status === "confirmed").length ||
      0;
    const pending =
      filteredRegistrations?.filter((r) => r.status === "pending").length || 0;
    const totalRevenue =
      filteredRegistrations?.reduce(
        (sum, r) => sum + (r.totalAmount || 0),
        0
      ) || 0;

    return [
      {
        title: "Total Registrations",
        value: total,
        icon: "👥",
        trend: "up",
        trendValue: `${total} Total`,
        color: "blue",
      },
      {
        title: "Total Revenue",
        value: `₹${totalRevenue.toLocaleString()}`,
        icon: "💰",
        trend: "up",
        trendValue: `${
          total > 0 ? "₹" + Math.round(totalRevenue / total) : "₹0"
        } avg`,
        color: "green",
      },
      {
        title: "Confirmed",
        value: confirmed,
        icon: "✅",
        trend: "up",
        trendValue: `${
          total > 0 ? ((confirmed / total) * 100).toFixed(1) : 0
        }%`,
        color: "emerald",
      },
      {
        title: "Pending",
        value: pending,
        icon: "⏳",
        trend: pending > 0 ? "neutral" : "up",
        trendValue: `${total > 0 ? ((pending / total) * 100).toFixed(1) : 0}%`,
        color: "yellow",
      },
    ];
  }, [filteredRegistrations]);

  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {opacity: 0, y: 20},
    visible: {opacity: 1, y: 0},
  };

  return (
    <motion.div
      className="p-4 space-y-6 pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Category & Game Filter */}
      <CategoryGameFilter
        registrations={registrations}
        onFilterChange={handleCategoryGameFilterChange}
      />

      {/* KPI Cards - 2 column grid on mobile */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Key Metrics
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {kpis.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              trend={kpi.trend}
              trendValue={kpi.trendValue}
              color={kpi.color}
            />
          ))}
        </div>
      </motion.div>

      {/* Conversion Funnel */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          Conversion Flow
        </h2>
        <ConversionFunnel registrations={filteredRegistrations} />
      </motion.div>

      {/* Game Analytics */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          Game Performance
        </h2>
        <GameAnalytics registrations={filteredRegistrations} />
      </motion.div>

      {/* Category Chart */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">📈</span>
          Category Distribution
        </h2>
        <CategoryChart registrations={filteredRegistrations} />
      </motion.div>

      {/* Insights Section */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-5"
      >
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Quick Insights
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">
              <span className="text-green-400 font-semibold">
                {filteredRegistrations?.filter((r) => r.status === "confirmed")
                  .length || 0}
              </span>{" "}
              participants have confirmed their registration
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">
              Total revenue of{" "}
              <span className="text-blue-400 font-semibold">
                ₹
                {(
                  filteredRegistrations?.reduce(
                    (sum, r) => sum + (r.totalAmount || 0),
                    0
                  ) || 0
                ).toLocaleString()}
              </span>{" "}
              collected so far
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">
              <span className="text-yellow-400 font-semibold">
                {filteredRegistrations?.filter((r) => r.status === "pending")
                  .length || 0}
              </span>{" "}
              registrations are awaiting confirmation
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WomenTournamentAnalytics;
