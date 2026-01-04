import {motion} from "framer-motion";
import {useMemo} from "react";

const CategoryChart = ({registrations}) => {
  const categoryStats = useMemo(() => {
    const stats = {
      category1: {count: 0, revenue: 0, color: "from-yellow-500 to-orange-500"},
      category2: {count: 0, revenue: 0, color: "from-blue-500 to-cyan-500"},
      category3: {count: 0, revenue: 0, color: "from-green-500 to-emerald-500"},
    };

    registrations.forEach((reg) => {
      const cat = reg.selectedCategory;
      if (stats[cat]) {
        stats[cat].count += 1;
        stats[cat].revenue += reg.totalAmount || 0;
      }
    });

    return Object.entries(stats).map(([key, data]) => ({
      name: key.replace("category", "Category "),
      ...data,
    }));
  }, [registrations]);

  const totalRevenue = categoryStats.reduce((sum, cat) => sum + cat.revenue, 0);
  const maxCount = Math.max(...categoryStats.map((c) => c.count), 1);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold font-orbitron text-white">
        Category Performance
      </h3>

      {/* Revenue Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h4 className="text-sm text-gray-400 mb-4">Revenue Distribution</h4>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Simple Donut Visualization */}
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {categoryStats.map((cat, index) => {
                  const percentage =
                    totalRevenue > 0 ? (cat.revenue / totalRevenue) * 100 : 0;
                  const previousPercentages = categoryStats
                    .slice(0, index)
                    .reduce(
                      (sum, c) =>
                        sum +
                        (totalRevenue > 0
                          ? (c.revenue / totalRevenue) * 100
                          : 0),
                      0
                    );

                  const circumference = 2 * Math.PI * 35;
                  const strokeDasharray = `${
                    (percentage / 100) * circumference
                  } ${circumference}`;
                  const strokeDashoffset = -(
                    (previousPercentages / 100) *
                    circumference
                  );

                  return (
                    <circle
                      key={cat.name}
                      cx="50"
                      cy="50"
                      r="35"
                      fill="none"
                      stroke={`url(#gradient-${index})`}
                      strokeWidth="12"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500"
                    />
                  );
                })}
                <defs>
                  <linearGradient
                    id="gradient-0"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#F97316" />
                  </linearGradient>
                  <linearGradient
                    id="gradient-1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                  <linearGradient
                    id="gradient-2"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    ₹{totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">Total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 space-y-2">
            {categoryStats.map((cat, index) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${cat.color}`}
                  />
                  <span className="text-sm text-gray-300">{cat.name}</span>
                </div>
                <span className="text-sm font-semibold text-white">
                  ₹{cat.revenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Registrations Bar Chart */}
        <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h4 className="text-sm text-gray-400 mb-6">
            Registrations by Category
          </h4>
          <div className="space-y-4">
            {categoryStats.map((cat, index) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">
                    {cat.name}
                  </span>
                  <span className="text-sm font-bold text-neon-blue">
                    {cat.count}
                  </span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{width: 0}}
                    animate={{width: `${(cat.count / maxCount) * 100}%`}}
                    transition={{duration: 0.8, delay: index * 0.1}}
                    className={`h-full bg-gradient-to-r ${cat.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
