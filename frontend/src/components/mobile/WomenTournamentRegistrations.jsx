import {useState, useMemo} from "react";
import {motion, AnimatePresence} from "framer-motion";
import RegistrationCard from "./RegistrationCard";

const WomenTournamentRegistrations = ({
  registrations,
  loading,
  onViewDetails,
  onUpdateStatus,
  onReject, // Add reject handler
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSport, setFilterSport] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showRejectedRegistrations, setShowRejectedRegistrations] =
    useState(false); // Add state for showing rejected registrations

  // Category sports mapping (matching WomenTournamentPage)
  const categorySportsMap = {
    category1: [
      "Sack Race",
      "3 Leg Race",
      "Balloon Bursting",
      "Brick Race",
      "Musical Chair",
      "Nimbu Chamach",
      "Powerlifting",
      "Weightlifting",
      "Skipping Rope",
    ],
    category2: ["Badminton", "Chess", "Carrom", "Athletics"],
    category3: [
      "Tug of War",
      "Volleyball",
      "Cricket",
      "Basketball 3x3",
      "Rink Football",
      "Box Cricket",
    ],
  };

  // Get sports based on selected category
  const sports = useMemo(() => {
    if (filterCategory === "all") {
      // Show all sports from all categories
      return [
        ...categorySportsMap.category1,
        ...categorySportsMap.category2,
        ...categorySportsMap.category3,
      ];
    } else {
      // Show all sports from selected category
      return categorySportsMap[filterCategory] || [];
    }
  }, [filterCategory]);

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((registration) => {
      // Skip rejected registrations in main list
      if (registration.isRejected) return false;

      // Search filter
      const matchesSearch =
        registration.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        registration.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        registration.registrationNumber
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        registration.mobileNumber?.includes(searchQuery) ||
        registration.category3TeamName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        filterStatus === "all" || registration.status === filterStatus;

      // Category filter
      const matchesCategory =
        filterCategory === "all" ||
        registration.selectedCategory === filterCategory;

      // Sport filter
      const matchesSport =
        filterSport === "all" ||
        registration.selectedSports?.includes(filterSport);

      return matchesSearch && matchesStatus && matchesCategory && matchesSport;
    });
  }, [registrations, searchQuery, filterStatus, filterCategory, filterSport]);

  // Separate rejected registrations
  const rejectedRegistrations = useMemo(() => {
    return registrations.filter((registration) => registration.isRejected);
  }, [registrations]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setFilterCategory("all");
    setFilterSport("all");
  };

  // Reset sport filter when category changes
  const handleCategoryChange = (category) => {
    setFilterCategory(category);
    setFilterSport("all"); // Reset sport filter when category changes
  };

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (filterStatus !== "all" ? 1 : 0) +
    (filterCategory !== "all" ? 1 : 0) +
    (filterSport !== "all" ? 1 : 0);

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Search Bar */}
      <div className="sticky top-36 z-30 bg-gray-900/95 backdrop-blur-lg -mx-4 px-4 py-3 border-b border-gray-800">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, college, number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            🔍
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-500/30 hover:to-purple-500/30 transition-all"
          >
            <span>🎯</span>
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              Clear all
            </button>
          )}

          <div className="ml-auto text-gray-400 text-sm">
            {filteredRegistrations.length} results
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{height: 0, opacity: 0}}
              animate={{height: "auto", opacity: 1}}
              exit={{height: 0, opacity: 0}}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-4">
                {/* Status Filter */}
                <div>
                  <label className="text-gray-400 text-xs mb-2 block">
                    Status
                  </label>
                  <div className="flex gap-2">
                    {["all", "confirmed", "pending", "cancelled"].map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => setFilterStatus(status)}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                            filterStatus === status
                              ? "bg-blue-500 text-white"
                              : "bg-gray-800 text-gray-400 hover:text-white"
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-gray-400 text-xs mb-2 block">
                    Category
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="category1">
                      Cat 1 - Individual Sports (₹49 Unlimited)
                    </option>
                    <option value="category2">
                      Cat 2 - Indoor Games (₹49 Per Game)
                    </option>
                    <option value="category3">
                      Cat 3 - Fun & Team Events (₹199 Per Team)
                    </option>
                  </select>
                </div>

                {/* Sport Filter - Only show when category is selected or all */}
                {sports.length > 0 && (
                  <div>
                    <label className="text-gray-400 text-xs mb-2 block">
                      Sport
                      {filterCategory !== "all" && (
                        <span className="ml-2 text-blue-400">
                          (
                          {filterCategory === "category1"
                            ? "Cat 1"
                            : filterCategory === "category2"
                            ? "Cat 2"
                            : "Cat 3"}{" "}
                          sports)
                        </span>
                      )}
                    </label>
                    <select
                      value={filterSport}
                      onChange={(e) => setFilterSport(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">
                        {filterCategory === "all"
                          ? "All Sports"
                          : `All ${
                              filterCategory === "category1"
                                ? "Cat 1"
                                : filterCategory === "category2"
                                ? "Cat 2"
                                : "Cat 3"
                            } Sports`}
                      </option>
                      {sports.map((sport) => (
                        <option key={sport} value={sport}>
                          {sport}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Registration Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-400 text-lg">No registrations found</p>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {filteredRegistrations.map((registration) => (
              <RegistrationCard
                key={registration._id}
                registration={registration}
                onViewDetails={onViewDetails}
                onUpdateStatus={onUpdateStatus}
                onReject={onReject}
              />
            ))}
          </div>

          {/* Rejected Registrations Section */}
          {rejectedRegistrations.length > 0 && (
            <div className="mt-8">
              <motion.button
                onClick={() =>
                  setShowRejectedRegistrations(!showRejectedRegistrations)
                }
                className="w-full bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between hover:bg-red-500/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🗑️</span>
                  <div className="text-left">
                    <h3 className="text-white font-semibold">
                      Rejected Registrations
                    </h3>
                    <p className="text-red-400 text-sm">
                      {rejectedRegistrations.length} rejected registration(s)
                    </p>
                  </div>
                </div>
                <motion.span
                  animate={{rotate: showRejectedRegistrations ? 180 : 0}}
                  transition={{duration: 0.3}}
                  className="text-white text-2xl"
                >
                  ▼
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {showRejectedRegistrations && (
                  <motion.div
                    initial={{height: 0, opacity: 0}}
                    animate={{height: "auto", opacity: 1}}
                    exit={{height: 0, opacity: 0}}
                    transition={{duration: 0.3}}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 mt-4">
                      {rejectedRegistrations.map((registration) => (
                        <RegistrationCard
                          key={registration._id}
                          registration={registration}
                          onViewDetails={onViewDetails}
                          onUpdateStatus={onUpdateStatus}
                          onReject={onReject}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WomenTournamentRegistrations;
