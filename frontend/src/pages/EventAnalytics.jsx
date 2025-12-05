import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {format} from "date-fns";
import api from "../config/api";

const EventAnalytics = () => {
  const {eventId} = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [filter, setFilter] = useState({status: "", search: ""});
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const COLORS = [
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444",
  ];

  useEffect(() => {
    fetchEventDetails();
    fetchAnalytics();
    fetchRegistrations();
  }, [eventId, filter, page]);

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/events/${eventId}`);
      setEvent(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch event details");
      console.error(error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(
        `/registrations/event/${eventId}/analytics`
      );
      setAnalytics(response.data.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.status) params.append("status", filter.status);
      if (filter.search) params.append("search", filter.search);
      params.append("page", page);
      params.append("limit", "20");

      const response = await api.get(
        `/registrations/event/${eventId}?${params.toString()}`
      );
      setRegistrations(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("Failed to fetch registrations");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get(`/registrations/event/${eventId}/export`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${event?.name}_registrations.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Registrations exported successfully");
    } catch (error) {
      toast.error("Failed to export registrations");
      console.error(error);
    }
  };

  const handleStatusUpdate = async (registrationId, newStatus) => {
    try {
      await api.patch(`/registrations/${registrationId}/status`, {
        status: newStatus,
      });
      toast.success("Status updated successfully");
      fetchRegistrations();
      fetchAnalytics();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  const totalRegistrations = analytics?.totalRegistrations[0]?.count || 0;
  const statusData =
    analytics?.statusBreakdown?.map((item) => ({
      name: item._id,
      value: item.count,
    })) || [];

  const institutionData =
    analytics?.institutionBreakdown?.filter((item) => item._id)?.slice(0, 10) ||
    [];
  const cityData =
    analytics?.cityBreakdown?.filter((item) => item._id)?.slice(0, 10) || [];
  const trendData =
    analytics?.dailyTrend?.map((item) => ({
      date: format(new Date(item._id), "MMM dd"),
      registrations: item.count,
    })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/events")}
            className="text-purple-300 hover:text-white transition-colors mb-4"
          >
            ← Back to Events
          </button>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {event?.name}
              </h1>
              <p className="text-purple-300">Event Analytics & Registrations</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg"
            >
              📊 Export to CSV
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <p className="text-purple-200 text-sm">Total Registrations</p>
            <p className="text-4xl font-bold text-white mt-2">
              {totalRegistrations}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <p className="text-purple-200 text-sm">Confirmed</p>
            <p className="text-4xl font-bold text-green-400 mt-2">
              {statusData.find((s) => s.name === "confirmed")?.value || 0}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <p className="text-purple-200 text-sm">Revenue</p>
            <p className="text-4xl font-bold text-yellow-400 mt-2">
              ₹
              {analytics?.paymentBreakdown?.reduce(
                (sum, item) => sum + (item.total || 0),
                0
              ) || 0}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <p className="text-purple-200 text-sm">Spots Left</p>
            <p className="text-4xl font-bold text-blue-400 mt-2">
              {event?.maxParticipants
                ? event.maxParticipants - totalRegistrations
                : "∞"}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Registration Trend */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Registration Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#a78bfa" />
                <YAxis stroke="#a78bfa" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1b4b",
                    border: "1px solid #a78bfa",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="registrations"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{fill: "#8b5cf6", r: 5}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Status Breakdown */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Status Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1b4b",
                    border: "1px solid #a78bfa",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Institutions */}
          {institutionData.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">
                Top Institutions
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={institutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis
                    dataKey="_id"
                    stroke="#a78bfa"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis stroke="#a78bfa" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1b4b",
                      border: "1px solid #a78bfa",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top Cities */}
          {cityData.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Top Cities</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="_id" stroke="#a78bfa" />
                  <YAxis stroke="#a78bfa" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1b4b",
                      border: "1px solid #a78bfa",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Registrations Table */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">All Registrations</h2>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search..."
                value={filter.search}
                onChange={(e) => {
                  setFilter({...filter, search: e.target.value});
                  setPage(1);
                }}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-purple-300"
              />
              <select
                value={filter.status}
                onChange={(e) => {
                  setFilter({...filter, status: e.target.value});
                  setPage(1);
                }}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              >
                <option value="">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="waitlist">Waitlist</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-purple-200 text-lg">No registrations found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-200">
                        Reg. No.
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-200">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-200">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-200">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-200">
                        Institution
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-200">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-200">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-200">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {registrations.map((reg) => (
                      <tr
                        key={reg._id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3 text-purple-200 text-sm font-mono">
                          {reg.registrationNumber}
                        </td>
                        <td className="px-4 py-3 text-white">{reg.name}</td>
                        <td className="px-4 py-3 text-purple-200 text-sm">
                          {reg.email}
                        </td>
                        <td className="px-4 py-3 text-purple-200 text-sm">
                          {reg.phone || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-purple-200 text-sm">
                          {reg.institution || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-purple-200 text-sm">
                          {format(new Date(reg.createdAt), "MMM dd, yyyy")}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={reg.status}
                            onChange={(e) =>
                              handleStatusUpdate(reg._id, e.target.value)
                            }
                            className={`px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20 ${
                              reg.status === "confirmed"
                                ? "text-green-200"
                                : reg.status === "pending"
                                ? "text-yellow-200"
                                : reg.status === "cancelled"
                                ? "text-red-200"
                                : "text-blue-200"
                            }`}
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="waitlist">Waitlist</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() =>
                              navigate(`/admin/registrations/${reg._id}`)
                            }
                            className="text-purple-300 hover:text-purple-100 text-sm"
                          >
                            View Details →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-purple-200">
                    Page {page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.pages}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;
