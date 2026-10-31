import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import api from "../../config/api";
import AdminLayout from "../../components/AdminLayout";
import useScrollLock from "../../hooks/useScrollLock";

const SECTION_META = {
  atharva: { title: "Atharva Joshi", color: "from-indigo-500/20 to-blue-500/20", border: "border-indigo-400/40" },
  balaji: { title: "Balaji Kalyankar", color: "from-amber-500/20 to-orange-500/20", border: "border-amber-400/40" },
  sagar: { title: "Sagar Ubale", color: "from-emerald-500/20 to-green-500/20", border: "border-emerald-400/40" },
};

const AdminMarathonRefund = () => {
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [summary, setSummary] = useState(null);
  const [refundData, setRefundData] = useState({
    atharva: [],
    balaji: [],
    sagar: [],
    unknown: [],
    rejected: [],
  });

  const orderedSections = useMemo(() => ["atharva", "balaji", "sagar"], []);
  useScrollLock(showScreenshotModal, "marathon-refund-screenshot-modal");

  const fetchRefunds = async (sync = true) => {
    try {
      setLoading(true);
      const response = await api.get(`/marathon/refund${sync ? "?sync=true" : "?sync=false"}`);
      if (response.data.success) {
        setSummary(response.data.summary);
        setRefundData(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load refund data");
    } finally {
      setLoading(false);
    }
  };

  const viewScreenshot = (screenshotUrl) => {
    setSelectedScreenshot(screenshotUrl);
    setShowScreenshotModal(true);
  };

  const updateRefundStatus = async (id, completed, sectionKey) => {
    const previous = refundData[sectionKey];
    setUpdatingId(id);

    setRefundData((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey].map((item) =>
        item._id === id
          ? {
              ...item,
              refundCompleted: completed,
              refundCompletedAt: completed ? new Date().toISOString() : null,
              refundCompletedBy: completed ? "admin" : null,
            }
          : item
      ),
    }));

    try {
      const response = await api.patch(`/marathon/refund/${id}`, { completed });
      if (response.data.success) {
        toast.success(completed ? "Refund marked completed" : "Refund marked pending");
        await fetchRefunds(false);
      }
    } catch (error) {
      setRefundData((prev) => ({ ...prev, [sectionKey]: previous }));
      toast.error(error.response?.data?.message || "Failed to update refund status");
    } finally {
      setUpdatingId("");
    }
  };

  useEffect(() => {
    fetchRefunds(false);
  }, []);

  return (
    <AdminLayout title="Marathon Refund">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-xl p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Marathon Refund Dashboard</h2>
              <p className="text-sm text-gray-400 mt-1">
                Grouped refund list from CSV with completion checkbox tracking.
              </p>
            </div>
            {/*
            <button
              onClick={handleSyncFromCsv}
              disabled={syncing}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition-colors"
            >
              {syncing ? "Syncing..." : "Sync CSV"}
            </button>
            */}
          </div>

          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mt-5 text-sm">
              <div className="bg-black/30 rounded-lg p-3 border border-white/10">Total: {summary.total}</div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/10">Atharva: {summary.atharva}</div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/10">Balaji: {summary.balaji}</div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/10">Sagar: {summary.sagar}</div>
              <div className="bg-black/30 rounded-lg p-3 border border-red-500/30 text-red-300">Rejected: {summary.rejected || 0}</div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/10">Pending: {summary.refundPending}</div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/10">Completed: {summary.refundCompleted}</div>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading refund list...</div>
        ) : (
          orderedSections.map((sectionKey) => {
            const section = refundData[sectionKey] || [];
            const meta = SECTION_META[sectionKey];

            return (
              <motion.div
                key={sectionKey}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl border ${meta.border} bg-black/70 p-4 backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">{meta.title}</h3>
                  <span className="text-sm text-gray-300">
                    {section.filter((item) => item.refundCompleted).length}/{section.length} completed
                  </span>
                </div>

                {section.length === 0 ? (
                  <div className="text-sm text-gray-400 py-4">No participants in this section.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b border-white/20">
                          <th className="py-2 pr-3">Done</th>
                          <th className="py-2 pr-3">Name</th>
                          <th className="py-2 pr-3">Mobile</th>
                          <th className="py-2 pr-3">Reg No.</th>
                          <th className="py-2 pr-3">Amount</th>
                          <th className="py-2 pr-3">Txn</th>
                          <th className="py-2 pr-3">Proof</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.map((item) => (
                          <tr key={item._id} className="border-b border-white/10">
                            <td className="py-2 pr-3">
                              <input
                                type="checkbox"
                                checked={item.refundCompleted}
                                disabled={updatingId === item._id}
                                onChange={(e) =>
                                  updateRefundStatus(item._id, e.target.checked, sectionKey)
                                }
                                className="w-4 h-4"
                              />
                            </td>
                            <td className="py-2 pr-3">{item.fullName}</td>
                            <td className="py-2 pr-3">{item.phone}</td>
                            <td className="py-2 pr-3">{item.registrationNumber}</td>
                            <td className="py-2 pr-3">Rs {item.amount}</td>
                            <td className="py-2 pr-3">{item.transactionId || "-"}</td>
                            <td className="py-2 pr-3">
                              {item.screenshotUrl ? (
                                <button
                                  type="button"
                                  onClick={() => viewScreenshot(item.screenshotUrl)}
                                  className="text-blue-300 hover:text-blue-200 underline"
                                >
                                  View
                                </button>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            );
          })
        )}

        {refundData.rejected?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red-500/40 bg-black/70 p-4 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-red-300">
                Rejected/Cancelled Registrations
              </h3>
              <span className="text-sm text-red-300">
                {refundData.rejected.length} records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-red-500/30">
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Mobile</th>
                    <th className="py-2 pr-3">Reg No.</th>
                    <th className="py-2 pr-3">Amount</th>
                    <th className="py-2 pr-3">Txn</th>
                    <th className="py-2 pr-3">Proof</th>
                  </tr>
                </thead>
                <tbody>
                  {refundData.rejected.map((item) => (
                    <tr key={item._id} className="border-b border-red-500/20">
                      <td className="py-2 pr-3 text-gray-200">{item.fullName}</td>
                      <td className="py-2 pr-3 text-gray-300">{item.phone}</td>
                      <td className="py-2 pr-3 text-gray-300">{item.registrationNumber}</td>
                      <td className="py-2 pr-3 text-gray-300">Rs {item.amount}</td>
                      <td className="py-2 pr-3 text-gray-300">{item.transactionId || "-"}</td>
                      <td className="py-2 pr-3">
                        {item.screenshotUrl ? (
                          <button
                            type="button"
                            onClick={() => viewScreenshot(item.screenshotUrl)}
                            className="text-blue-300 hover:text-blue-200 underline"
                          >
                            View
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showScreenshotModal && selectedScreenshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-hidden"
            onClick={() => setShowScreenshotModal(false)}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] w-full"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowScreenshotModal(false)}
                className="absolute -top-12 right-0 text-white text-3xl hover:text-red-400 transition-colors z-10"
              >
                ✕
              </motion.button>
              <img
                src={selectedScreenshot}
                alt="Payment Screenshot"
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg border-2 border-blue-400/30"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={selectedScreenshot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-blue-600/80 text-white rounded-lg font-semibold backdrop-blur-sm"
                >
                  Open in New Tab
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={selectedScreenshot}
                  download="payment-screenshot.jpg"
                  className="px-6 py-2 bg-green-600/80 text-white rounded-lg font-semibold backdrop-blur-sm"
                >
                  Download
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminMarathonRefund;
