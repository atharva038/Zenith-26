import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {motion} from "framer-motion";
import api from "../config/api";
import AdminLayout from "../components/AdminLayout";

const EventManagement = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: "",
    isActive: "",
    search: "",
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchStats();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.category) params.append("category", filter.category);
      if (filter.isActive !== "") params.append("isActive", filter.isActive);
      if (filter.search) params.append("search", filter.search);
      params.append("limit", "50");

      const response = await api.get(`/events?${params.toString()}`);
      setEvents(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch events");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/events/stats");
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleToggleStatus = async (eventId) => {
    try {
      await api.patch(`/events/${eventId}/toggle-status`);
      toast.success("Event status updated");
      fetchEvents();
    } catch (error) {
      toast.error("Failed to update event status");
      console.error(error);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await api.delete(`/events/${eventId}`);
      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete event");
      console.error(error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AdminLayout title="Events">
      <div className="mb-6 flex justify-end">
        <motion.button
          whileHover={{scale: 1.02}}
          whileTap={{scale: 0.98}}
          onClick={() => navigate("/admin/events/create")}
          className="bg-gradient-to-r from-neon-blue to-electric-cyan text-white px-6 py-3 rounded-lg font-rajdhani font-semibold hover:shadow-lg hover:shadow-neon-blue/50 transition-all"
        >
          + Create New Event
        </motion.button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <p className="text-purple-200 text-sm">Total Events</p>
          <p className="text-3xl font-bold text-white">
            {stats.total[0]?.count || 0}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <p className="text-purple-200 text-sm">Active Events</p>
          <p className="text-3xl font-bold text-green-400">
            {stats.active[0]?.count || 0}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <p className="text-purple-200 text-sm">Published Events</p>
          <p className="text-3xl font-bold text-blue-400">
            {stats.published[0]?.count || 0}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <p className="text-purple-200 text-sm">Total Registrations</p>
          <p className="text-3xl font-bold text-yellow-400">
            {stats.totalRegistrations || 0}
          </p>
        </div>
      </div>
      )}

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search events..."
            value={filter.search}
            onChange={(e) => setFilter({...filter, search: e.target.value})}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-purple-300"
          />
          <select
            value={filter.category}
            onChange={(e) =>
              setFilter({...filter, category: e.target.value})
            }
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          >
            <option value="">All Categories</option>
            <option value="Sports">Sports</option>
            <option value="Cultural">Cultural</option>
            <option value="Technical">Technical</option>
            <option value="Workshop">Workshop</option>
            <option value="Competition">Competition</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={filter.isActive}
            onChange={(e) =>
              setFilter({...filter, isActive: e.target.value})
            }
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-12 text-center border border-white/20">
          <p className="text-purple-200 text-lg">No events found</p>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                      Event Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                      Deadline
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                      Registrations
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {events.map((event) => (
                    <tr
                      key={event._id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">
                          {event.name}
                        </div>
                        <div className="text-purple-300 text-sm">
                          {event.shortDescription}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/30 text-purple-200">
                          {event.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-purple-200">
                        {formatDate(event.registrationDeadline)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-yellow-400 font-semibold">
                          {event.registrationCount || 0}
                        </span>
                        {event.maxParticipants && (
                          <span className="text-purple-300">
                            {" "}
                            / {event.maxParticipants}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              event.isActive
                                ? "bg-green-500/30 text-green-200"
                                : "bg-red-500/30 text-red-200"
                            }`}
                          >
                            {event.isActive ? "Active" : "Inactive"}
                          </span>
                          {event.isPublished && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200">
                              Published
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/events/${event._id}/analytics`)
                            }
                            className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded hover:bg-blue-500/50 transition-colors text-sm"
                          >
                            Analytics
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/events/${event._id}/edit`)
                            }
                            className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded hover:bg-purple-500/50 transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(event._id)}
                            className="px-3 py-1 bg-yellow-500/30 text-yellow-200 rounded hover:bg-yellow-500/50 transition-colors text-sm"
                          >
                            Toggle
                          </button>
                          <button
                            onClick={() => handleDelete(event._id)}
                            className="px-3 py-1 bg-red-500/30 text-red-200 rounded hover:bg-red-500/50 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </AdminLayout>
  );
};

export default EventManagement;