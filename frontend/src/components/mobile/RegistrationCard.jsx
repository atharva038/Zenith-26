import {motion} from "framer-motion";

const RegistrationCard = ({
  registration,
  onViewDetails,
  onUpdateStatus,
  onReject, // Add reject handler
  readOnly = false,
}) => {
  const statusColors = {
    confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const statusIcons = {
    confirmed: "✅",
    pending: "⏳",
    cancelled: "❌",
  };

  const isRejected = registration.isRejected;

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      className={`backdrop-blur-xl border rounded-xl p-4 space-y-3 ${
        isRejected
          ? "bg-red-900/20 border-red-500/30"
          : "bg-gray-800/50 border-gray-700"
      }`}
    >
      {/* Rejected Badge */}
      {isRejected && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-2 w-fit">
          <span>🗑️</span>
          REJECTED
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg truncate">
            {registration.name || "N/A"}
          </h3>
          <p className="text-gray-400 text-sm">
            Reg: {registration.registrationNumber}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 flex-shrink-0 ${
            statusColors[registration.status] || statusColors.pending
          }`}
        >
          <span>{statusIcons[registration.status] || statusIcons.pending}</span>
          {registration.status?.toUpperCase()}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-700">
        <div>
          <p className="text-gray-500 text-xs mb-1">Sports</p>
          <p className="text-white font-medium text-sm">
            {registration.selectedSports?.length || 0} Selected
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">Category</p>
          <p className="text-white font-medium text-sm">
            {registration.selectedCategory?.replace("category", "Cat ") ||
              "N/A"}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">Contact</p>
          <p className="text-white font-medium text-sm truncate">
            {registration.mobileNumber || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">Amount</p>
          <p className="text-green-400 font-semibold text-sm">
            ₹{registration.totalAmount || 0}
          </p>
        </div>
        {registration.email && (
          <div className="col-span-2">
            <p className="text-gray-500 text-xs mb-1">Email</p>
            <p className="text-white font-medium text-sm truncate">
              {registration.email}
            </p>
          </div>
        )}
      </div>

      {/* Sports List */}
      {registration.selectedSports &&
        registration.selectedSports.length > 0 && (
          <div className="pt-2 border-t border-gray-700">
            <p className="text-gray-500 text-xs mb-2">Registered Sports:</p>
            <div className="flex flex-wrap gap-2">
              {registration.selectedSports.map((sport, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs"
                >
                  {sport}
                </span>
              ))}
            </div>
          </div>
        )}

      {/* Team Name for Category 3 */}
      {registration.category3TeamName && (
        <div className="pt-2 border-t border-gray-700">
          <p className="text-gray-500 text-xs mb-1">Team Name</p>
          <p className="text-white font-medium text-sm">
            {registration.category3TeamName}
          </p>
        </div>
      )}

      {/* Payment Screenshot Link */}
      {registration.paymentScreenshot && (
        <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
          <span className="text-gray-400 text-sm">Payment:</span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              registration.paymentStatus === "completed"
                ? "bg-green-500/20 text-green-400"
                : registration.paymentStatus === "pending"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {registration.paymentStatus?.toUpperCase()}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(registration.paymentScreenshot, "_blank");
            }}
            className="ml-auto text-blue-400 text-sm hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            <span>🖼️</span>
            View Receipt
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onViewDetails(registration)}
          className="flex-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white py-2 rounded-lg text-sm font-medium hover:from-blue-500/30 hover:to-purple-500/30 transition-all"
        >
          View Details
        </button>
        {!readOnly && !isRejected && registration.status !== "confirmed" && onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus(registration._id, "confirmed")}
            className="px-4 bg-green-500/20 border border-green-500/30 text-green-400 py-2 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-all"
          >
            ✓
          </button>
        )}
        {!readOnly && onReject && (
          <button
            onClick={() => onReject(registration._id)}
            className={`px-4 border py-2 rounded-lg text-sm font-medium transition-all ${
              isRejected
                ? "bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30"
                : "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
            }`}
            title={isRejected ? "Restore" : "Reject"}
          >
            {isRejected ? "↩️" : "🗑️"}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default RegistrationCard;
