import jwt from "jsonwebtoken";
import GameCoordinator from "../models/GameCoordinator.js";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

// Login game coordinator
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username and password",
      });
    }

    // Find coordinator
    const coordinator = await GameCoordinator.findOne({ username });

    if (!coordinator) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if active
    if (!coordinator.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Check password
    const isMatch = await coordinator.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update last login
    coordinator.lastLogin = new Date();
    await coordinator.save();

    // Generate token
    const token = jwt.sign(
      { id: coordinator._id, role: "game-coordinator" },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      coordinator: {
        id: coordinator._id,
        username: coordinator.username,
        email: coordinator.email,
        assignedSports: coordinator.assignedSports,
      },
    });
  } catch (error) {
    console.error("Game coordinator login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const coordinator = req.coordinator;

    // Build query based on assigned sports
    const sportsQuery =
      coordinator.assignedSports.length > 0
        ? { category: { $in: coordinator.assignedSports } }
        : {};

    // Get events for assigned sports
    const events = await Event.find(sportsQuery).select("_id name category");
    const eventIds = events.map((e) => e._id);
    const eventNames = events.map((e) => e.name);

    // Get ALL registrations for these sports (for accurate stats)
    const registrationsQuery =
      eventNames.length > 0 ? { eventName: { $in: eventNames } } : {};

    const allRegistrations = await Registration.find(registrationsQuery).lean();

    // Calculate detailed statistics
    const sportCounts = {};
    let totalTeams = 0;
    let totalPlayers = 0;
    let needAccommodation = 0;
    let pendingStatus = 0;
    let confirmed = 0;
    let cancelled = 0;

    allRegistrations.forEach((reg) => {
      // Count status for all registrations
      if (reg.status === "pending") pendingStatus++;
      if (reg.status === "confirmed") confirmed++;
      if (reg.status === "cancelled") {
        cancelled++;
        return; // Skip cancelled from other counts
      }

      // Only count active registrations (confirmed/pending)
      const sport = reg.eventName;
      sportCounts[sport] = (sportCounts[sport] || 0) + 1;

      totalTeams++;

      // Total players
      const numPlayers = parseInt(
        reg.formData?.num_players || reg.formData?.get?.("num_players") || 0,
      );
      totalPlayers += numPlayers;

      // Accommodation
      const needAccom =
        reg.accommodation?.needed ||
        reg.formData?.needs_accommodation ||
        reg.formData?.need_accommodation ||
        reg.formData?.get?.("need_accommodation");
      if (needAccom) needAccommodation++;
    });

    // Get recent registrations
    const recentRegistrations = allRegistrations
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map((reg) => ({
        _id: reg._id,
        name: reg.name,
        email: reg.email,
        phone: reg.phone,
        eventName: reg.eventName,
        status: reg.status,
        paymentStatus: reg.paymentStatus,
        createdAt: reg.createdAt,
      }));

    res.json({
      success: true,
      data: {
        sportCounts,
        totalTeams,
        totalPlayers,
        needAccommodation,
        pendingStatus,
        confirmed,
        cancelled,
        recentRegistrations,
        assignedSports: coordinator.assignedSports,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
};

// Get all registrations for assigned sports
export const getRegistrations = async (req, res) => {
  try {
    const coordinator = req.coordinator;
    const {
      page = 1,
      limit = 50,
      status,
      search,
      eventName,
      paymentStatus,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build registrations query based on assigned sports (using eventName)
    const query = {};
    
    // Filter by assigned sports if coordinator has specific sports assigned
    if (coordinator.assignedSports.length > 0) {
      query.eventName = { $in: coordinator.assignedSports };
    }

    // Apply filters
    if (status) query.status = status;
    if (eventName) query.eventName = eventName; // Override with specific eventName if provided
    if (paymentStatus) query.paymentStatus = paymentStatus;

    // Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { institution: { $regex: search, $options: "i" } },
        { registrationNumber: { $regex: search, $options: "i" } },
        { eventName: { $regex: search, $options: "i" } },
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [registrations, total] = await Promise.all([
      Registration.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Registration.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: registrations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get registrations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch registrations",
      error: error.message,
    });
  }
};

// Get registration by ID
export const getRegistrationById = async (req, res) => {
  try {
    const coordinator = req.coordinator;
    const { id } = req.params;

    const registration = await Registration.findById(id).lean();

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Check if coordinator has access to this registration's sport
    const event = await Event.findById(registration.eventId);
    if (
      coordinator.assignedSports.length > 0 &&
      !coordinator.assignedSports.includes(event.category)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this registration",
      });
    }

    res.json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("Get registration error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch registration",
      error: error.message,
    });
  }
};

// Get current coordinator profile
export const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.coordinator,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};
