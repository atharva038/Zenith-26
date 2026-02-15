import {useState, useEffect, useCallback} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../config/api";

const SPORTS_LIST = [
  "All Sports",
  "Cricket",
  "Box Cricket",
  "Football",
  "Basketball",
  "Basketball (3x3)",
  "Volleyball",
  "Badminton",
  "Table Tennis",
  "Chess",
  "Carrom",
  "Athletics",
  "Swimming",
  "Kabaddi",
  "Kho-Kho",
  "Hockey",
  "Lawn Tennis",
  "Squash",
  "Handball",
  "Rink Football",
  "Tug of War",
  "Power Lifting",
];

const isSoloRegistration = (eventName, formData) => {
  const genderCategory = formData?.gender_category || 
                         formData?.get?.("gender_category") ||
                         formData?.sportDetails?.selectedGender;
  
  const alwaysSoloSports = ["Power Lifting"];
  if (alwaysSoloSports.includes(eventName)) return true;
  
  if (eventName === "Chess" && genderCategory === "individual") return true;
  if (eventName === "Athletics" && genderCategory === "individual") return true;
  
  return false;
};

const getCategoryBadgeInfo = (eventName, formData) => {
  const genderCategory = formData?.gender_category || 
                         formData?.get?.("gender_category") ||
                         formData?.sportDetails?.selectedGender;
  
  if (eventName === "Power Lifting") {
    return {
      label: " Solo",
      shortLabel: " Solo",
      className: "bg-cyan-500/20 text-cyan-300 border-cyan-500/20",
    };
  }
  
  if (!genderCategory) return null;
  
  if (eventName === "Chess" || eventName === "Athletics") {
    if (genderCategory === "team") {
      return {
        label: eventName === "Athletics" ? " Relay Team" : " Team",
        shortLabel: eventName === "Athletics" ? " Relay" : " Team",
        className: "bg-purple-500/20 text-purple-300 border-purple-500/20",
      };
    } else if (genderCategory === "individual") {
      return {
        label: " Solo",
        shortLabel: " Solo",
        className: "bg-cyan-500/20 text-cyan-300 border-cyan-500/20",
      };
    }
  }
  
  if (genderCategory === "men") {
    return {
      label: " Men's Registration",
      shortLabel: " Men's",
      className: "bg-blue-500/20 text-blue-300",
    };
  } else if (genderCategory === "women") {
    return {
      label: " Women's Registration",
      shortLabel: " Women's",
      className: "bg-pink-500/20 text-pink-300",
    };
  }
  
  return null;
};

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const [coordinator, setCoordinator] = useState(null);
  const [stats, setStats] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    sport: "",
    status: "",
    search: "",
    needAccommodation: "",
    page: 1,
    limit: 50,
  });
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchDashboardStats = useCallback(async (token) => {
    try {
      const statsRes = await api.get("/game-coordinator/dashboard/stats", {
        headers: {Authorization: `Bearer ${token}`},
      });
      setStats(statsRes.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("coordinatorToken");
        localStorage.removeItem("coordinatorData");
        navigate("/coordinator/login");
      }
    }
  }, [navigate]);

  const fetchRegistrations = useCallback(async (token) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.sport && filters.sport !== "All Sports") {
        queryParams.append("eventName", filters.sport);
      }
      
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.search) queryParams.append("search", filters.search);
      queryParams.append("page", filters.page);
      queryParams.append("limit", filters.limit);

      const response = await api.get(`/game-coordinator/registrations?${queryParams}`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      
      if (response.data.success) {
        let allRegistrations = response.data.data || [];
        
        if (filters.needAccommodation) {
          allRegistrations = allRegistrations.filter(reg => {
            const needAccom = reg.accommodation?.needed || 
                            reg.formData?.needs_accommodation || 
                            reg.formData?.need_accommodation || 
                            reg.formData?.get?.("need_accommodation");
            return filters.needAccommodation === "yes" ? needAccom === true : needAccom === false;
          });
        }
        
        setRegistrations(allRegistrations);
        setPagination(response.data.pagination || {});
      }
    } catch (error) {
      toast.error("Failed to fetch registrations");
      console.error(error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const coordinatorData = localStorage.getItem("coordinatorData");
    if (!coordinatorData) {
      navigate("/coordinator/login");
      return;
    }
    
    setCoordinator(JSON.parse(coordinatorData));
    const token = localStorage.getItem("coordinatorToken");
    if (token) {
      fetchDashboardStats(token);
      fetchRegistrations(token);
    }
  }, [navigate, fetchDashboardStats, fetchRegistrations]);

  const handleLogout = () => {
    localStorage.removeItem("coordinatorToken");
    localStorage.removeItem("coordinatorData");
    navigate("/coordinator/login");
  };

  const handleFilterChange = (newFilters, isOnlyPageChange = false) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: isOnlyPageChange ? newFilters.page : 1,
    }));
  };

  const handleClearAllFilters = () => {
    setFilters({
      sport: "",
      status: "",
      search: "",
      needAccommodation: "",
      page: 1,
      limit: 50,
    });
  };

  const hasActiveFilters = () => {
    return filters.sport || filters.status || filters.search || filters.needAccommodation;
  };

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
    setShowDetailsModal(true);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const sportFilter = filters.sport && filters.sport !== "All Sports" ? filters.sport : "All Sports";

    doc.setFontSize(18);
    doc.text(`Sports Registrations - ${sportFilter}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Coordinator: ${coordinator?.username}`, 14, 34);

    const tableData = registrations
      .filter((reg) => reg.status !== "cancelled")
      .map((reg, index) => {
      const formData = reg.formData || {};
      const isSolo = isSoloRegistration(reg.eventName, formData);
      return [
        index + 1,
        reg.registrationNumber || "N/A",
        reg.eventName || "N/A",
        isSolo ? "-" : (formData.team_name || formData.get?.("team_name") || "N/A"),
        isSolo ? "-" : (formData.captain_name || formData.get?.("captain_name") || "N/A"),
        formData.captain_contact || formData.get?.("captain_contact") || "N/A",
        reg.institution || "N/A",
        isSolo ? "1" : (formData.num_players || formData.get?.("num_players") || "N/A"),
        reg.status || "N/A",
      ];
    });

    autoTable(doc, {
      startY: 40,
      head: [["#", "Reg No.", "Sport", "Team Name", "Captain", "Contact", "Institution", "Players", "Status"]],
      body: tableData,
      styles: {fontSize: 8},
      headStyles: {fillColor: [34, 197, 94]},
    });

    doc.save(`sports-registrations-${sportFilter.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.pdf`);
    toast.success("PDF exported successfully");
  };

  const exportToCSV = () => {
    const sportFilter = filters.sport && filters.sport !== "All Sports" ? filters.sport : "All Sports";
    
    const csvData = registrations
      .filter((reg) => reg.status !== "cancelled")
      .map((reg, index) => {
      const formData = reg.formData || {};
      const isSolo = isSoloRegistration(reg.eventName, formData);
      return {
        "#": index + 1,
        "Registration Number": reg.registrationNumber || "N/A",
        "Sport": reg.eventName || "N/A",
        "Team Name": isSolo ? "-" : (formData.team_name || formData.get?.("team_name") || "N/A"),
        "Captain Name": isSolo ? "-" : (formData.captain_name || formData.get?.("captain_name") || "N/A"),
        "Contact": formData.captain_contact || formData.get?.("captain_contact") || "N/A",
        "Email": reg.email || "N/A",
        "Institution": reg.institution || "N/A",
        "City": reg.city || "N/A",
        "Number of Players": isSolo ? "1" : (formData.num_players || formData.get?.("num_players") || "N/A"),
        "Need Accommodation": (formData.need_accommodation || formData.get?.("need_accommodation")) ? "Yes" : "No",
        "Status": reg.status || "N/A",
        "Registered On": new Date(reg.createdAt).toLocaleDateString(),
      };
    });

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], {type: "text/csv"});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sports-registrations-${sportFilter.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.csv`;
    a.click();
    toast.success("CSV exported successfully");
  };

  return (null);
};

export default CoordinatorDashboard;
