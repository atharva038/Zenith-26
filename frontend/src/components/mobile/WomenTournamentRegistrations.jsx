import {useState, useMemo} from "react";
import {motion, AnimatePresence} from "framer-motion";
import RegistrationCard from "./RegistrationCard";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const WomenTournamentRegistrations = ({
  registrations,
  loading,
  filters,
  onFilterChange,
  categorySportsMap,
  onViewDetails,
  onUpdateStatus,
  onReject,
  activeRegistrations,
  rejectedRegistrations,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showRejectedRegistrations, setShowRejectedRegistrations] = useState(false);

  // Get sports based on selected category (same logic as desktop)
  const getAvailableSports = () => {
    if (!filters.category) {
      return [
        ...categorySportsMap.category1,
        ...categorySportsMap.category2,
        ...categorySportsMap.category3,
      ];
    }
    return categorySportsMap[filters.category] || [];
  };

  const sports = getAvailableSports();

  // Clear all filters - uses parent's onFilterChange
  const handleClearFilters = () => {
    onFilterChange({
      search: "",
      category: "",
      sport: "",
      status: "",
    });
  };

  // Export to PDF function - Same logic as desktop
  const handleExportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.setTextColor(0, 229, 255);
      doc.text("Zenith 2026 - Women's Tournament", 14, 20);
      
      // Add generation date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 28);
      
      // Add filter info if any
      if (filters.status || filters.category || filters.sport || filters.search) {
        doc.setFontSize(9);
        let filterInfo = "Showing: ";
        if (filters.status) filterInfo += `${filters.status.toUpperCase()} | `;
        if (filters.category) {
          const catLabel = filters.category === "category1" ? "Cat 1 (Individual)" : 
                          filters.category === "category2" ? "Cat 2 (Indoor)" : "Cat 3 (Team)";
          filterInfo += `${catLabel} | `;
        }
        if (filters.sport) filterInfo += `${filters.sport}`;
        doc.text(filterInfo, 14, 34);
      }
      
      // Add total count
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(`Total Participants: ${activeRegistrations.length}`, 14, 42);
      
      // Prepare simplified table data
      const tableData = activeRegistrations.map((reg, index) => [
        index + 1,
        reg.name || "N/A",
        reg.mobileNumber || "N/A",
        reg.selectedCategory === "category1" ? "Cat 1" : 
          reg.selectedCategory === "category2" ? "Cat 2" : "Cat 3",
        reg.selectedSports?.join(", ") || "N/A",
        reg.category3TeamName || "-",
      ]);
      
      // Add table
      autoTable(doc, {
        startY: 50,
        head: [["#", "Name", "Mobile", "Category", "Sports", "Team Name"]],
        body: tableData,
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: [0, 229, 255],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          fontSize: 10,
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 45 },
          2: { cellWidth: 30 },
          3: { cellWidth: 20, halign: 'center' },
          4: { cellWidth: 55 },
          5: { cellWidth: 35 },
        },
        margin: { left: 7, right: 7 },
      });
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }
      
      // Save with same naming convention as desktop
      let fileName = "Zenith_2026_Women_Tournament";
      if (filters.category) {
        const catName = filters.category === "category1" ? "_Cat1" : 
                       filters.category === "category2" ? "_Cat2" : "_Cat3";
        fileName += catName;
      }
      if (filters.sport) {
        fileName += `_${filters.sport.replace(/\s+/g, '_')}`;
      }
      fileName += `_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("PDF Export Error:", error);
    }
  };

  // Reset sport filter when category changes - same logic as desktop
  const handleCategoryChange = (category) => {
    onFilterChange({
      category: category,
      sport: "", // Reset sport when category changes
    });
  };

  const activeFiltersCount =
    (filters.search ? 1 : 0) +
    (filters.status ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.sport ? 1 : 0);

  return (
    <div className="pb-20">
      {/* Sticky Search and Filter Bar */}
      <div className="sticky top-36 z-30 bg-gray-900/95 backdrop-blur-lg -mx-4 px-4 py-3 border-b border-gray-800">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, college, number..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            🔍
          </span>
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: "" })}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Toggle and Actions Row */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
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

          {/* Export to PDF Button */}
          <button
            onClick={handleExportToPDF}
            disabled={activeRegistrations.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-500/30 hover:to-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Export current view to PDF"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
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
            {activeRegistrations.length} results
          </div>
        </div>
      </div>

      {/* Filter Panel - Outside sticky container, below it */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            className="overflow-hidden bg-gray-900 -mx-4 px-4 border-b border-gray-800"
          >
            <div className="space-y-3 py-4">
              {/* Status Filter */}
              <div>
                <label className="text-gray-400 text-xs mb-2 block">
                  Status
                </label>
                <div className="flex gap-2">
                  {["", "confirmed", "pending", "cancelled"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => onFilterChange({ status })}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          filters.status === status
                            ? "bg-blue-500 text-white"
                            : "bg-gray-800 text-gray-400 hover:text-white"
                        }`}
                      >
                        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "All"}
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
                  value={filters.category || ""}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Categories</option>
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

              {/* Sport Filter */}
              {sports.length > 0 && (
                <div>
                  <label className="text-gray-400 text-xs mb-2 block">
                    Sport
                    {filters.category && (
                      <span className="ml-2 text-blue-400">
                        (
                        {filters.category === "category1"
                          ? "Cat 1"
                          : filters.category === "category2"
                          ? "Cat 2"
                          : "Cat 3"}{" "}
                        sports)
                      </span>
                    )}
                  </label>
                  <select
                    value={filters.sport || ""}
                    onChange={(e) => onFilterChange({ sport: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">
                      {!filters.category
                        ? "All Sports"
                        : `All ${
                            filters.category === "category1"
                              ? "Cat 1"
                              : filters.category === "category2"
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

      {/* Content Area with proper padding */}
      <div className="p-4 space-y-4">
      {/* Registration Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      ) : activeRegistrations.length === 0 ? (
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
            {activeRegistrations.map((registration) => (
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
    </div>
  );
};

export default WomenTournamentRegistrations;
