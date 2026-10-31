import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../config/api";
import AdminLayout from "../../components/AdminLayout";

const AdminAccommodation = () => {
  const [players, setPlayers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSport, setFilterSport] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Get unique sports list
  const uniqueSports = [...new Set(players.map(p => p.eventName))].sort();

  // Fetch accommodation list
  const fetchAccommodationList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/accommodation-list");
      setPlayers(response.data.data.players);
      setSummary(response.data.data.summary);
      toast.success("Accommodation list loaded successfully");
    } catch (error) {
      console.error("Error fetching accommodation list:", error);
      toast.error("Failed to fetch accommodation list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccommodationList();
  }, [fetchAccommodationList]);

  // Filter and sort players
  const filteredPlayers = players
    .filter((player) => {
      // Search filter
      const matchesSearch =
        player.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.phone?.includes(searchTerm) ||
        player.institution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.eventName?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        filterStatus === "all" || player.status === filterStatus;

      // Sport filter
      const matchesSport =
        filterSport === "all" || player.eventName === filterSport;

      return matchesSearch && matchesStatus && matchesSport;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "institution":
          return (a.institution || "").localeCompare(b.institution || "");
        case "eventName":
          return a.eventName.localeCompare(b.eventName);
        case "numDays":
          return (b.numDays || 0) - (a.numDays || 0);
        case "numPeople":
          return (b.numPeople || 0) - (a.numPeople || 0);
        default:
          return 0;
      }
    });

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Accommodation List (Individual Players) - Zenith 2026", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Total Individual Players: ${filteredPlayers.length}`, 14, 34);
    
    if (summary) {
      doc.text(`Total Days: ${summary.totalDays} | Total People: ${summary.totalPeople}`, 14, 40);
      doc.text(`Total Fee: ₹${summary.totalAccommodationFee.toLocaleString()}`, 14, 46);
    }
    
    doc.setFontSize(8);
    doc.text(`Note: Each team member listed individually. Cricket players excluded.`, 14, 52);

    // Table
    const tableData = filteredPlayers.map((player, index) => [
      index + 1,
      player.name,
      player.phone,
      player.institution || "N/A",
      player.eventName,
      player.numDays || 0,
      player.numPeople || 0,
      `₹${player.accommodationFee || 0}`,
      player.status,
    ]);

    autoTable(doc, {
      startY: 58,
      head: [
        [
          "#",
          "Name",
          "Phone",
          "Institution",
          "Sport",
          "Days",
          "People",
          "Fee",
          "Status",
        ],
      ],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`accommodation-list-${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("PDF exported successfully");
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Institution",
      "City",
      "Sport",
      "Days",
      "People",
      "Accommodation Fee",
      "Status",
      "Registration Number",
      "Registration Date",
    ];

    const rows = filteredPlayers.map((player) => [
      player.name,
      player.email,
      player.phone,
      player.institution || "",
      player.city || "",
      player.eventName,
      player.numDays || 0,
      player.numPeople || 0,
      player.accommodationFee || 0,
      player.status,
      player.registrationNumber || "",
      player.registrationDate
        ? new Date(player.registrationDate).toLocaleString()
        : "",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n"
    );

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `accommodation-list-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("CSV exported successfully");
  };

  return (
    <AdminLayout title="🏨 Accommodation List">
      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-neon-blue/10 to-electric-cyan/10 border border-neon-blue/30 rounded-xl p-4"
          >
            <div className="text-gray-400 text-sm mb-1">Total Players</div>
            <div className="text-3xl font-bold text-neon-blue">
              {summary.totalPlayers}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4"
          >
            <div className="text-gray-400 text-sm mb-1">Confirmed</div>
            <div className="text-3xl font-bold text-green-400">
              {summary.confirmedPlayers}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4"
          >
            <div className="text-gray-400 text-sm mb-1">Pending</div>
            <div className="text-3xl font-bold text-yellow-400">
              {summary.pendingPlayers}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4"
          >
            <div className="text-gray-400 text-sm mb-1">Total Days</div>
            <div className="text-3xl font-bold text-purple-400">
              {summary.totalDays}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {summary.totalPeople} people
            </div>
          </motion.div>

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-4"
          >
            <div className="text-gray-400 text-sm mb-1">Total Fee</div>
            <div className="text-2xl font-bold text-orange-400">
              ₹{summary.totalAccommodationFee.toLocaleString()}
            </div>
          </motion.div> */}
        </div>
      )}

      {/* Controls */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, phone, institution, or sport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue/50"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-blue/50"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
          </select>

          {/* Sport Filter */}
          <select
            value={filterSport}
            onChange={(e) => setFilterSport(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-blue/50"
          >
            <option value="all">All Sports</option>
            {uniqueSports.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-blue/50"
          >
            <option value="name">Sort by Name</option>
            <option value="institution">Sort by Institution</option>
            <option value="eventName">Sort by Sport</option>
            <option value="numDays">Sort by Days</option>
            <option value="numPeople">Sort by People</option>
          </select>

          {/* Export Buttons */}
          <button
            onClick={exportToPDF}
            className="px-6 py-3 bg-gradient-to-r from-neon-blue/20 to-electric-cyan/20 border border-neon-blue/50 rounded-lg text-white font-semibold hover:from-neon-blue/30 hover:to-electric-cyan/30 transition-all"
          >
            📄 PDF
          </button>

          <button
            onClick={exportToCSV}
            className="px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg text-white font-semibold hover:from-green-500/30 hover:to-emerald-500/30 transition-all"
          >
            📊 CSV
          </button>

          {/* Refresh Button */}
          <button
            onClick={fetchAccommodationList}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all"
          >
            🔄
          </button>
        </div>

        {/* Filter Stats */}
        {(filterSport !== "all" || filterStatus !== "all" || searchTerm) && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-gray-400">Active Filters:</span>
              {filterSport !== "all" && (
                <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue border border-neon-blue/30 rounded-full">
                  Sport: {filterSport}
                </span>
              )}
              {filterStatus !== "all" && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
                  Status: {filterStatus}
                </span>
              )}
              {searchTerm && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full">
                  Search: "{searchTerm}"
                </span>
              )}
              <button
                onClick={() => {
                  setFilterSport("all");
                  setFilterStatus("all");
                  setSearchTerm("");
                }}
                className="px-3 py-1 text-red-400 hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Players List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full"
          />
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          {/* Info Banner */}
          <div className="bg-neon-blue/10 border-b border-neon-blue/30 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-neon-blue">
              <span>👥</span>
              <span className="font-semibold">
                Individual Player List - Each team member listed separately
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Institution
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Sport
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Accommodation
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Fee
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredPlayers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      No players found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredPlayers.map((player, index) => (
                    <motion.tr
                      key={player.registrationId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-white">
                          {player.name}
                        </div>
                        {player.registrationNumber && (
                          <div className="text-xs text-gray-400">
                            {player.registrationNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-white">{player.phone}</div>
                        <div className="text-xs text-gray-400">
                          {player.email}
                        </div>
                        {player.city && (
                          <div className="text-xs text-gray-500">
                            {player.city}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-white">
                        {player.institution || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-neon-blue/20 text-neon-blue border border-neon-blue/30">
                          {player.eventName}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-white">
                          {player.numDays || 0} day(s)
                        </div>
                        <div className="text-xs text-gray-400">
                          {player.numPeople || 0} people
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-orange-400">
                        ₹{(player.accommodationFee || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            player.status === "confirmed"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : player.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                          }`}
                        >
                          {player.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Results count */}
          {filteredPlayers.length > 0 && (
            <div className="px-4 py-3 bg-white/5 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing {filteredPlayers.length} of {players.length} players
                  {filteredPlayers.length < players.length && (
                    <span className="ml-2 text-yellow-400">
                      (filtered)
                    </span>
                  )}
                </div>
                {filterSport !== "all" && (
                  <div className="text-sm text-neon-blue">
                    📍 {filterSport}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Note */}
      <div className="mt-6 bg-gradient-to-r from-neon-blue/10 to-electric-cyan/10 border border-neon-blue/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <div className="font-semibold text-white mb-1">About This List</div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Shows ALL individual players (except Cricket) who need accommodation</li>
              <li>• Each team member is listed separately with their contact details</li>
              <li>• Duplicate phone numbers are automatically removed</li>
              <li>• If a player is registered in multiple sports, they appear only once</li>
              <li>• Cancelled registrations are excluded</li>
              <li>• Export to PDF or CSV for offline use</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAccommodation;
