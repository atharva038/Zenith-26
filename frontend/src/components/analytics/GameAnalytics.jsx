import {motion} from "framer-motion";
import {useMemo} from "react";

const GameAnalytics = ({registrations}) => {
  const gameStats = useMemo(() => {
    const stats = {};

    registrations.forEach((reg) => {
      reg.selectedSports.forEach((sport) => {
        if (!stats[sport]) {
          stats[sport] = {
            count: 0,
            revenue: 0,
            confirmed: 0,
          };
        }
        stats[sport].count += 1;
        stats[sport].revenue += reg.totalAmount || 0;
        if (reg.status === "confirmed") {
          stats[sport].confirmed += 1;
        }
      });
    });

    const gamesArray = Object.entries(stats).map(([name, data]) => ({
      name,
      ...data,
      confirmationRate:
        data.count > 0 ? ((data.confirmed / data.count) * 100).toFixed(1) : 0,
    }));

    return gamesArray.sort((a, b) => b.revenue - a.revenue);
  }, [registrations]);

  const maxRevenue = Math.max(...gameStats.map((g) => g.revenue), 1);
  const topGame = gameStats[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold font-orbitron text-white mb-2">
          Game-Wise Performance
        </h3>
        {topGame && (
          <p className="text-sm text-gray-400">
            <span className="text-neon-blue font-semibold">{topGame.name}</span>{" "}
            leads with{" "}
            <span className="text-green-400 font-semibold">
              ₹{topGame.revenue.toLocaleString()}
            </span>{" "}
            revenue and{" "}
            <span className="text-purple-400 font-semibold">
              {topGame.confirmationRate}%
            </span>{" "}
            confirmation rate.
          </p>
        )}
      </div>

      {/* Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gameStats.map((game, index) => (
          <motion.div
            key={game.name}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: index * 0.05}}
            className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-xl p-5 hover:border-neon-blue/50 transition-all"
          >
            {/* Game Name & Rank */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-white font-rajdhani">
                {game.name}
              </h4>
              {index < 3 && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    index === 0
                      ? "bg-yellow-500/20 text-yellow-400"
                      : index === 1
                      ? "bg-gray-400/20 text-gray-300"
                      : "bg-orange-500/20 text-orange-400"
                  }`}
                >
                  #{index + 1}
                </span>
              )}
            </div>

            {/* Revenue Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Revenue</span>
                <span className="text-green-400 font-semibold">
                  ₹{game.revenue.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{width: 0}}
                  animate={{width: `${(game.revenue / maxRevenue) * 100}%`}}
                  transition={{duration: 0.8, ease: "easeOut"}}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-500/10 rounded-lg p-3">
                <p className="text-2xl font-bold text-blue-400">{game.count}</p>
                <p className="text-xs text-gray-400">Registrations</p>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-3">
                <p className="text-2xl font-bold text-purple-400">
                  {game.confirmationRate}%
                </p>
                <p className="text-xs text-gray-400">Confirmed</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {gameStats.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-2">📊</p>
          <p>No game data available</p>
        </div>
      )}
    </div>
  );
};

export default GameAnalytics;
