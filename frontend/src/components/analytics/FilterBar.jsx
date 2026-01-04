import {motion, AnimatePresence} from "framer-motion";
import {useState} from "react";

const FilterBar = ({filters, setFilters, availableGames, onExport}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const dateRangeOptions = [
    {label: "All Time", value: "all"},
    {label: "Today", value: "today"},
    {label: "Last 7 Days", value: "7days"},
    {label: "Last 30 Days", value: "30days"},
  ];

  const categories = ["All", "Category 1", "Category 2", "Category 3"];
  const statuses = ["All", "Confirmed", "Pending", "Cancelled"];

  return (
    <>
      {/* Desktop Filter Bar */}
      <div className="hidden lg:block sticky top-16 z-20 bg-black/40 backdrop-blur-xl border-y border-gray-700/50 py-4">
        <div className="flex flex-wrap items-center gap-4 px-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px] max-w-md">
            <input
              type="text"
              placeholder="Search by name, reg no, mobile..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full px-4 py-2 bg-gray-900/60 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue/50 focus:outline-none"
            />
          </div>

          {/* Date Range */}
          <select
            value={filters.dateRange}
            onChange={(e) =>
              setFilters({...filters, dateRange: e.target.value})
            }
            className="px-4 py-2 bg-gray-900/60 border border-gray-700/50 rounded-lg text-white focus:border-neon-blue/50 focus:outline-none cursor-pointer"
          >
            {dateRangeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="px-4 py-2 bg-gray-900/60 border border-gray-700/50 rounded-lg text-white focus:border-neon-blue/50 focus:outline-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option
                key={cat}
                value={cat === "All" ? "" : cat.toLowerCase().replace(" ", "")}
              >
                {cat}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-4 py-2 bg-gray-900/60 border border-gray-700/50 rounded-lg text-white focus:border-neon-blue/50 focus:outline-none cursor-pointer"
          >
            {statuses.map((status) => (
              <option
                key={status}
                value={status === "All" ? "" : status.toLowerCase()}
              >
                {status}
              </option>
            ))}
          </select>

          {/* Export Button */}
          <motion.button
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            onClick={onExport}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg text-white font-semibold flex items-center gap-2"
          >
            <span>📥</span>
            Export CSV
          </motion.button>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden sticky top-16 z-20 bg-black/40 backdrop-blur-xl border-y border-gray-700/50 p-4">
        <motion.button
          whileTap={{scale: 0.95}}
          onClick={() => setShowMobileFilters(true)}
          className="w-full px-4 py-3 bg-gradient-to-r from-neon-blue to-electric-cyan rounded-lg text-white font-semibold flex items-center justify-center gap-2"
        >
          <span>🔍</span>
          Filters & Search
        </motion.button>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{y: "100%"}}
              animate={{y: 0}}
              exit={{y: "100%"}}
              transition={{type: "spring", damping: 25}}
              className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl z-50 max-h-[80vh] overflow-y-auto lg:hidden"
            >
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Search */}
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({...filters, search: e.target.value})
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />

                {/* Date Range */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) =>
                      setFilters({...filters, dateRange: e.target.value})
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  >
                    {dateRangeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      setFilters({...filters, category: e.target.value})
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  >
                    {categories.map((cat) => (
                      <option
                        key={cat}
                        value={
                          cat === "All"
                            ? ""
                            : cat.toLowerCase().replace(" ", "")
                        }
                      >
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({...filters, status: e.target.value})
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  >
                    {statuses.map((status) => (
                      <option
                        key={status}
                        value={status === "All" ? "" : status.toLowerCase()}
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 bg-gradient-to-r from-neon-blue to-electric-cyan rounded-lg text-white font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterBar;
