import {useMemo, useState, useEffect} from "react";
import {motion} from "framer-motion";

const CategoryGameFilter = ({registrations, onFilterChange}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGames, setSelectedGames] = useState([]);

  // Define sports by category
  const sportsByCategory = {
    category1: [
      "Badminton",
      "Table Tennis",
      "Chess",
      "Carrom",
      "Athletics (100m)",
      "Athletics (200m)",
      "Athletics (4x100 Relay)",
    ],
    category2: ["BGMI", "Valorant", "Free Fire"],
    category3: [
      "Tug of War",
      "Musical Chair",
      "Passing the Parcel",
      "Lemon Race",
    ],
  };

  // Get available games based on selected category
  const availableGames = useMemo(() => {
    if (selectedCategory === "all") {
      return [
        ...sportsByCategory.category1,
        ...sportsByCategory.category2,
        ...sportsByCategory.category3,
      ];
    }
    return sportsByCategory[selectedCategory] || [];
  }, [selectedCategory]);

  // Get actual games from registrations
  const gamesInData = useMemo(() => {
    const allGames = new Set();
    registrations?.forEach((reg) => {
      reg.selectedSports?.forEach((sport) => {
        allGames.add(sport);
      });
    });
    return Array.from(allGames);
  }, [registrations]);

  // Filter available games to only show those that exist in data
  const filteredAvailableGames = useMemo(() => {
    return availableGames.filter((game) => gamesInData.includes(game));
  }, [availableGames, gamesInData]);

  // Reset selected games when category changes
  useEffect(() => {
    setSelectedGames([]);
  }, [selectedCategory]);

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange({
      category: selectedCategory,
      games: selectedGames,
    });
  }, [selectedCategory, selectedGames, onFilterChange]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleGameToggle = (game) => {
    setSelectedGames((prev) => {
      if (prev.includes(game)) {
        return prev.filter((g) => g !== game);
      } else {
        return [...prev, game];
      }
    });
  };

  const handleClearGames = () => {
    setSelectedGames([]);
  };

  return (
    <motion.div
      initial={{opacity: 0, y: -10}}
      animate={{opacity: 1, y: 0}}
      className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-4 mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🎯</span>
        <h3 className="text-white font-semibold">Filter by Category & Game</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Dropdown */}
        <div>
          <label className="text-gray-400 text-xs mb-2 block">Category</label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="all">All Categories</option>
            <option value="category1">Category 1 (Individual Sports)</option>
            <option value="category2">Category 2 (E-Sports)</option>
            <option value="category3">Category 3 (Fun & Team Events)</option>
          </select>
        </div>

        {/* Game Multi-Select */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-gray-400 text-xs">Games</label>
            {selectedGames.length > 0 && (
              <button
                onClick={handleClearGames}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Clear ({selectedGames.length})
              </button>
            )}
          </div>

          {filteredAvailableGames.length > 0 ? (
            <div className="bg-gray-900/50 border border-gray-600 rounded-lg max-h-40 overflow-y-auto">
              {filteredAvailableGames.map((game) => (
                <label
                  key={game}
                  className="flex items-center px-4 py-2 hover:bg-gray-700/30 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedGames.includes(game)}
                    onChange={() => handleGameToggle(game)}
                    className="mr-3 w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <span className="text-white text-sm">{game}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-8 text-center">
              <p className="text-gray-500 text-sm">
                {selectedCategory === "all"
                  ? "No games available in data"
                  : `No ${selectedCategory.replace(
                      "category",
                      "Category "
                    )} games in data`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Selected Games Display */}
      {selectedGames.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-gray-400 text-xs mb-2">Selected Games:</p>
          <div className="flex flex-wrap gap-2">
            {selectedGames.map((game) => (
              <span
                key={game}
                className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm border border-blue-500/30 flex items-center gap-2"
              >
                {game}
                <button
                  onClick={() => handleGameToggle(game)}
                  className="hover:text-blue-300 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CategoryGameFilter;
