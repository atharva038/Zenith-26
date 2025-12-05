import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {format} from "date-fns";
import api from "../config/api";

const EventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({category: "", search: ""});

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.category) params.append("category", filter.category);
      if (filter.search) params.append("search", filter.search);

      const response = await api.get(`/events/public?${params.toString()}`);
      setEvents(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch events");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (event) => {
    if (!event.isRegistrationOpen) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/30 text-red-200">
          Closed
        </span>
      );
    }
    if (event.isFull) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/30 text-yellow-200">
          Full
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/30 text-green-200">
        Open
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Zenith 2026 Events
          </h1>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Register for exciting competitions, workshops, and cultural events.
            Join us for an unforgettable experience!
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search events..."
              value={filter.search}
              onChange={(e) => setFilter({...filter, search: e.target.value})}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={filter.category}
              onChange={(e) => setFilter({...filter, category: e.target.value})}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Categories</option>
              <option value="Sports">Sports</option>
              <option value="Cultural">Cultural</option>
              <option value="Technical">Technical</option>
              <option value="Workshop">Workshop</option>
              <option value="Competition">Competition</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-20 text-center border border-white/20">
            <p className="text-purple-200 text-xl">
              No events found. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group"
                onClick={() => navigate(`/events/${event._id}`)}
              >
                {/* Event Header */}
                <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/40 text-purple-100">
                      {event.category}
                    </span>
                    {getStatusBadge(event)}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                    {event.name}
                  </h3>
                  {event.shortDescription && (
                    <p className="text-purple-200 text-sm line-clamp-2">
                      {event.shortDescription}
                    </p>
                  )}
                </div>

                {/* Event Details */}
                <div className="p-6 space-y-3">
                  {event.eventDate && (
                    <div className="flex items-center text-purple-200">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm">
                        {format(
                          new Date(event.eventDate),
                          "MMM dd, yyyy - hh:mm a"
                        )}
                      </span>
                    </div>
                  )}

                  {event.venue && (
                    <div className="flex items-center text-purple-200">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-sm">{event.venue}</span>
                    </div>
                  )}

                  <div className="flex items-center text-purple-200">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <span className="text-sm">
                      {event.registrationCount} registered
                      {event.spotsLeft !== null &&
                        ` • ${event.spotsLeft} spots left`}
                    </span>
                  </div>

                  <div className="flex items-center text-purple-200">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm">
                      Register by{" "}
                      {format(
                        new Date(event.registrationDeadline),
                        "MMM dd, yyyy"
                      )}
                    </span>
                  </div>

                  {event.registrationFee > 0 && (
                    <div className="flex items-center text-yellow-400 font-semibold">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>₹{event.registrationFee}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 pt-0">
                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                      event.isRegistrationOpen && !event.isFull
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg"
                        : "bg-gray-600 text-gray-300 cursor-not-allowed"
                    }`}
                    disabled={!event.isRegistrationOpen || event.isFull}
                  >
                    {event.isRegistrationOpen && !event.isFull
                      ? "Register Now"
                      : "Registration Closed"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
