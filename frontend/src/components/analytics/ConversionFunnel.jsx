import {motion} from "framer-motion";
import {useMemo} from "react";

const ConversionFunnel = ({registrations}) => {
  const funnelData = useMemo(() => {
    const total = registrations.length;
    const confirmed = registrations.filter(
      (r) => r.status === "confirmed"
    ).length;
    const pending = registrations.filter((r) => r.status === "pending").length;
    const cancelled = registrations.filter(
      (r) => r.status === "cancelled"
    ).length;

    const confirmedRate =
      total > 0 ? ((confirmed / total) * 100).toFixed(1) : 0;
    const pendingRate = total > 0 ? ((pending / total) * 100).toFixed(1) : 0;

    return {
      stages: [
        {
          label: "Total Registered",
          value: total,
          percentage: 100,
          color: "from-blue-500 to-cyan-500",
          icon: "📝",
        },
        {
          label: "Confirmed",
          value: confirmed,
          percentage: confirmedRate,
          color: "from-green-500 to-emerald-500",
          icon: "✅",
        },
        {
          label: "Pending",
          value: pending,
          percentage: pendingRate,
          color: "from-yellow-500 to-orange-500",
          icon: "⏳",
        },
      ],
      cancelled,
    };
  }, [registrations]);

  const stages = funnelData.stages;

  return (
    <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold font-orbitron text-white mb-2">
          Conversion Funnel
        </h3>
        <p className="text-sm text-gray-400">
          {stages[1].percentage}% conversion rate from registration to
          confirmation
        </p>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const width = stage.percentage;
          const dropoffCount =
            index < stages.length - 1
              ? stage.value - stages[index + 1].value
              : 0;
          // Ensure minimum width for visibility, especially on mobile
          const minWidth = stage.value > 0 ? 30 : 20;

          return (
            <motion.div
              key={stage.label}
              initial={{opacity: 0, x: -20}}
              animate={{opacity: 1, x: 0}}
              transition={{delay: index * 0.2}}
              className="relative"
            >
              {/* Stage Container */}
              <div
                className="relative mx-auto rounded-xl overflow-hidden"
                style={{width: `${Math.max(width, minWidth)}%`}}
              >
                <div
                  className={`bg-gradient-to-r ${stage.color} px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2`}
                >
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <span className="text-xl md:text-2xl flex-shrink-0">
                      {stage.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-medium text-white/90 truncate">
                        {stage.label}
                      </p>
                      <p className="text-xs text-white/70">
                        {stage.percentage}%
                      </p>
                    </div>
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-white flex-shrink-0">
                    {stage.value}
                  </p>
                </div>
              </div>

              {/* Drop-off indicator - only show if there's actual drop-off */}
              {index === 0 && dropoffCount > 0 && (
                <div className="flex items-center justify-center mt-2">
                  <div className="flex items-center gap-2 text-xs text-red-400">
                    <span>↓</span>
                    <span>
                      {dropoffCount} dropped
                      {funnelData.cancelled > 0
                        ? ` (${funnelData.cancelled} cancelled)`
                        : ""}
                    </span>
                  </div>
                </div>
              )}

              {/* Between Confirmed and Pending - show if pending exists */}
              {index === 1 && stages[2].value > 0 && (
                <div className="flex items-center justify-center mt-2">
                  <div className="flex items-center gap-2 text-xs text-yellow-400">
                    <span>⏳</span>
                    <span>{stages[2].value} awaiting confirmation</span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversionFunnel;
