import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import api from "../config/api";

const TshirtDistribution = () => {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDistributed, setFilterDistributed] = useState("all"); // all, distributed, pending
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  // COMMENTED OUT - Team member name tracking
  // const [memberName, setMemberName] = useState("");
  // const [showNameModal, setShowNameModal] = useState(false);
  // const [selectedRegistration, setSelectedRegistration] = useState(null);

  // Fetch registrations
  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/marathon/registrations", {
        params: {
          status: "confirmed",
          search: searchQuery,
        },
      });

      if (response.data.success) {
        let filtered = response.data.data;

        // Apply distribution filter
        if (filterDistributed === "distributed") {
          filtered = filtered.filter((r) => r.tshirtDistributed);
        } else if (filterDistributed === "pending") {
          filtered = filtered.filter((r) => !r.tshirtDistributed);
        }

        setRegistrations(filtered);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterDistributed]);

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await api.get("/marathon/tshirt-distribution/stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchStats();
  }, [fetchRegistrations]);

  // Mark T-shirt as distributed
  const markDistributed = async (id) => {
    try {
      const response = await api.patch(`/marathon/${id}/tshirt-distributed`);

      if (response.data.success) {
        toast.success("T-shirt marked as distributed ✓");
        fetchRegistrations();
        fetchStats();
        setShowConfirmModal(false);
        setSelectedRegistration(null);
      }
    } catch (error) {
      console.error("Error marking distributed:", error);
      toast.error(error.response?.data?.message || "Failed to update");
    }
  };

  // Show confirmation modal
  const handleMarkAsGiven = (registration) => {
    setSelectedRegistration(registration);
    setShowConfirmModal(true);
  };

  // Undo distribution
  const undoDistribution = async (id) => {
    if (!window.confirm("Are you sure you want to undo this distribution?")) {
      return;
    }

    try {
      const response = await api.patch(
        `/marathon/${id}/undo-tshirt-distribution`
      );

      if (response.data.success) {
        toast.success("Distribution undone");
        fetchRegistrations();
        fetchStats();
      }
    } catch (error) {
      console.error("Error undoing distribution:", error);
      toast.error("Failed to undo distribution");
    }
  };

  // COMMENTED OUT - Team member modal functions
  // // Handle mark as distributed button click
  // const handleMarkDistributed = (registration) => {
  //   setSelectedRegistration(registration);
  //   setShowNameModal(true);
  // };

  // // Submit distribution with member name
  // const submitDistribution = () => {
  //   if (!memberName.trim()) {
  //     toast.error("Please enter your name");
  //     return;
  //   }
  //   markDistributed(selectedRegistration._id, memberName.trim());
  //   setMemberName("");
  // };

  if (loading && !registrations.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-orange-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🎽 T-Shirt Distribution
              </h1>
              <p className="text-gray-400">
                Marathon Day - Track T-shirt distribution
              </p>
            </div>

            {/* Statistics Cards */}
            {stats && (
              <div className="flex flex-wrap gap-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                  <div className="text-green-400 text-sm font-medium">
                    Distributed
                  </div>
                  <div className="text-white text-2xl font-bold">
                    {stats.distributed}
                  </div>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3">
                  <div className="text-orange-400 text-sm font-medium">
                    Pending
                  </div>
                  <div className="text-white text-2xl font-bold">
                    {stats.pending}
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
                  <div className="text-blue-400 text-sm font-medium">
                    Progress
                  </div>
                  <div className="text-white text-2xl font-bold">
                    {stats.percentage}%
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, registration number, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {[
              { value: "all", label: "All", color: "bg-gray-500" },
              { value: "pending", label: "Pending", color: "bg-orange-500" },
              {
                value: "distributed",
                label: "Distributed",
                color: "bg-green-500",
              },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterDistributed(filter.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterDistributed === filter.value
                    ? `${filter.color} text-white`
                    : `bg-white/5 text-gray-400 hover:bg-white/10`
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Registrations List */}
        <div className="space-y-3">
          {registrations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎽</div>
              <p className="text-gray-400 text-lg">No registrations found</p>
            </div>
          ) : (
            registrations.map((registration) => (
              <motion.div
                key={registration._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white/5 border rounded-xl p-4 backdrop-blur-sm ${
                  registration.tshirtDistributed
                    ? "border-green-500/30"
                    : "border-orange-500/20"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Registration Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      {/* Status Indicator */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          registration.tshirtDistributed
                            ? "bg-green-500/20 border-2 border-green-500"
                            : "bg-orange-500/20 border-2 border-orange-500"
                        }`}
                      >
                        {registration.tshirtDistributed ? (
                          <svg
                            className="w-6 h-6 text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <span className="text-2xl">👕</span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-white font-bold text-lg">
                            {registration.fullName}
                          </h3>
                          <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full font-medium">
                            {registration.registrationNumber}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                          <div className="flex items-center gap-1 text-gray-400">
                            <svg
                              className="w-4 h-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <span className="truncate">{registration.phone}</span>
                          </div>

                          <div className="flex items-center gap-1 text-gray-400">
                            <svg
                              className="w-4 h-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            {registration.gender}
                          </div>

                          <div className="flex items-center gap-1 text-gray-400">
                            <svg
                              className="w-4 h-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                            Age: {registration.age}
                          </div>

                          <div className="flex items-center gap-1 text-gray-400">
                            <svg
                              className="w-4 h-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                            <span className="truncate">{registration.college}</span>
                          </div>
                        </div>

                        {/* Distribution Info */}
                        {registration.tshirtDistributed && (
                          <div className="mt-2 flex items-center gap-2 text-sm flex-wrap">
                            <span className="text-green-400 font-medium">
                              ✓ T-shirt Distributed
                            </span>
                            {/* COMMENTED OUT - Team member tracking
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-400">
                              by {registration.tshirtDistributedBy}
                            </span>
                            */}
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-400">
                              {new Date(
                                registration.tshirtDistributedAt
                              ).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex gap-2 md:flex-shrink-0">
                    {!registration.tshirtDistributed ? (
                      <button
                        onClick={() => handleMarkAsGiven(registration)}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-orange-500/30 whitespace-nowrap"
                      >
                        ✓ Mark as Given
                      </button>
                    ) : (
                      <button
                        onClick={() => undoDistribution(registration._id)}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all border border-white/20 whitespace-nowrap"
                      >
                        ↺ Undo
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white mb-2 text-center">
              Mark T-shirt as Given?
            </h3>

            {/* Participant Info */}
            <div className="mb-6 text-center">
              <p className="text-gray-400 text-sm mb-2">Participant:</p>
              <p className="text-white font-bold text-lg">
                {selectedRegistration.fullName}
              </p>
              <p className="text-orange-400 text-sm font-mono">
                {selectedRegistration.registrationNumber}
              </p>
            </div>

            {/* Warning/Info */}
            <div className="mb-6 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
              <p className="text-orange-300 text-sm text-center">
                ⚠️ Please verify the participant's ID before confirming
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedRegistration(null);
                }}
                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={() => markDistributed(selectedRegistration._id)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-orange-500/30"
              >
                ✓ Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* COMMENTED OUT - Member Name Modal */}
      {/* {showNameModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/30 rounded-2xl p-8 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Confirm Distribution
            </h3>

            <div className="mb-6">
              <p className="text-gray-400 mb-2">Distributing T-shirt to:</p>
              <p className="text-white font-bold text-lg">
                {selectedRegistration?.fullName}
              </p>
              <p className="text-gray-500 text-sm">
                {selectedRegistration?.registrationNumber}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 mb-2 text-sm font-medium">
                Your Name (Team Member)
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && submitDistribution()}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={submitDistribution}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-lg transition-all"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowNameModal(false);
                  setSelectedRegistration(null);
                  setMemberName("");
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )} */}
    </div>
  );
};

export default TshirtDistribution;
