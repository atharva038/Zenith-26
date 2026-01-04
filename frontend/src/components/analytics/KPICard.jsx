import {motion} from "framer-motion";

const KPICard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color,
  onClick,
  isActive,
}) => {
  return (
    <motion.div
      whileHover={{scale: 1.02, y: -4}}
      whileTap={{scale: 0.98}}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all ${
        isActive
          ? `bg-gradient-to-br ${color} border-2 border-white/30`
          : "bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 hover:border-gray-600/50"
      }`}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 opacity-10 bg-gradient-to-br ${color}`}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`text-3xl ${isActive ? "opacity-100" : "opacity-60"}`}
          >
            {icon}
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                trend === "up"
                  ? "bg-green-500/20 text-green-400"
                  : trend === "down"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl md:text-3xl font-bold font-orbitron text-white">
            {value}
          </h3>
          <p className="text-sm text-gray-400 font-rajdhani">{title}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default KPICard;
