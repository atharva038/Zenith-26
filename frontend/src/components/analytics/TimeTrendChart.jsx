import {motion} from "framer-motion";
import {useMemo, useState} from "react";

const TimeTrendChart = ({registrations}) => {
  const [view, setView] = useState("daily"); // daily, weekly, monthly

  const trendData = useMemo(() => {
    if (registrations.length === 0) return [];

    const grouped = {};

    registrations.forEach((reg) => {
      const date = new Date(reg.createdAt);
      let key;

      if (view === "daily") {
        key = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else if (view === "weekly") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else {
        key = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      }

      if (!grouped[key]) {
        grouped[key] = 0;
      }
      grouped[key] += 1;
    });

    return Object.entries(grouped)
      .map(([date, count]) => ({date, count}))
      .slice(-10); // Last 10 periods
  }, [registrations, view]);

  const maxCount = Math.max(...trendData.map((d) => d.count), 1);

  return (
    <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold font-orbitron text-white">
          Registration Trends
        </h3>

        {/* View Toggle */}
        <div className="flex gap-2 bg-gray-800/60 rounded-lg p-1">
          {["daily", "weekly", "monthly"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                view === v
                  ? "bg-neon-blue text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 flex items-end justify-between gap-2">
        {trendData.map((data, index) => {
          const height = (data.count / maxCount) * 100;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <motion.div
                initial={{height: 0}}
                animate={{height: `${height}%`}}
                transition={{duration: 0.5, delay: index * 0.05}}
                className="w-full bg-gradient-to-t from-neon-blue to-electric-cyan rounded-t-lg relative group cursor-pointer"
              >
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none">
                  <p className="text-white font-semibold">
                    {data.count} registrations
                  </p>
                  <p className="text-gray-400 text-xs">{data.date}</p>
                </div>
              </motion.div>
              <p className="text-xs text-gray-500 truncate w-full text-center">
                {data.date}
              </p>
            </div>
          );
        })}
      </div>

      {trendData.length === 0 && (
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="text-4xl mb-2">📈</p>
            <p>No trend data available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTrendChart;
