import mongoose from "mongoose";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import {Parser} from "json2csv";
import {
  sendPendingRegistrationEmail,
  sendApprovedRegistrationEmail,
} from "../services/email.service.js";

// Sport fees configuration - must match frontend
const SPORTS_FEES = {
  Cricket: {amount: 6500, note: "per team"},
  "Box Cricket": {amount: 3000, note: "per team"},
  Football: {amount: 3000, note: "per team"},
  Basketball: {men: 2500, women: 1500, note: "per team"},
  Volleyball: {men: 2200, women: 1500, note: "per team"},
  Badminton: {boys: 1000, girls: 800, mixed: 600, note: "per team"},
  "Table Tennis": {amount: 400, note: "per player"},
  Chess: {
    team: 500,
    individual: 200,
    note: "Team: ₹500 per team | Solo: ₹200 per player (mixed)",
  },
  Carrom: {amount: 300, note: "per player"},
  Athletics: {
    individual: 200,
    team: 700,
    note: "Individual: ₹200 (100m, Long Jump) | Team: ₹700 (Relay, Mixed Relay)",
  },
  Swimming: {amount: 300, note: "per athlete"},
  Kabaddi: {men: 2200, women: 1500, note: "per team"},
  "Kho-Kho": {amount: 1500, note: "per team"},
  Hockey: {amount: 2500, note: "per team"},
  "Lawn Tennis": {amount: 500, note: "per player"},
  Squash: {amount: 400, note: "per player"},
  Handball: {amount: 1500, note: "per team"},
  "Rink Football": {men: 2200, women: 1500, note: "per team"},
  "Tug of War": {amount: 1000, note: "per team"},
  "Power Lifting": {amount: 300, note: "per player"},
};

// Helper function to calculate registration fee based on sport and category
const calculateSportFee = (sportName, genderCategory) => {
  const feeInfo = SPORTS_FEES[sportName];

  if (!feeInfo) {
    console.warn(`No fee info found for sport: ${sportName}`);
    return 500; // Default fallback
  }

  // If fee has a single amount, return it
  if (feeInfo.amount) {
    return feeInfo.amount;
  }

  // Handle gender/category-specific fees
  if (genderCategory) {
    const category = genderCategory.toLowerCase();

    // For sports with men/women categories
    if (feeInfo.men && category === "men") return feeInfo.men;
    if (feeInfo.women && category === "women") return feeInfo.women;

    // For sports with boys/girls/mixed categories (Badminton)
    if (feeInfo.boys && category === "boys") return feeInfo.boys;
    if (feeInfo.girls && category === "girls") return feeInfo.girls;
    if (feeInfo.mixed && category === "mixed") return feeInfo.mixed;

    // For sports with team/individual categories (Chess, Athletics)
    if (feeInfo.team && category === "team") return feeInfo.team;
    if (feeInfo.individual && category === "individual") return feeInfo.individual;
  }

  // Fallback: return first available fee
  return (
    feeInfo.amount ||
    feeInfo.men ||
    feeInfo.women ||
    feeInfo.boys ||
    feeInfo.girls ||
    feeInfo.mixed ||
    feeInfo.team ||
    feeInfo.individual ||
    500
  );
};

// Create new registration
export const createRegistration = async (req, res) => {
  try {
    let {eventId, formData} = req.body;

    // Parse formData if it's a string (from multipart/form-data)
    if (typeof formData === "string") {
      formData = JSON.parse(formData);
    }

    // Validate event exists and is open
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (!event.isRegistrationOpen()) {
      return res.status(400).json({
        success: false,
        message: "Registration is closed for this event",
      });
    }

    // Check if event is full
    const isFull = await event.isFull();
    if (isFull) {
      return res.status(400).json({
        success: false,
        message: "Event registration is full",
      });
    }

    // Validate document uploads
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: "Please upload all required documents",
      });
    }

    const {permissionLetter, transactionReceipt, captainIdCard} = req.files;

    if (!permissionLetter || !transactionReceipt || !captainIdCard) {
      return res.status(400).json({
        success: false,
        message:
          "All three documents are required: Permission Letter, Transaction Receipt, and Captain's ID Card",
      });
    }

    // Extract common fields with better field name matching
    const email =
      formData.email ||
      formData.Email ||
      formData["Email ID"] ||
      formData.email_id;
    const name =
      formData.captain_name ||
      formData.team_name ||
      formData.name ||
      formData.Name ||
      formData["Captain Name"] ||
      formData["Team Name"];
    const phone =
      formData.captain_contact ||
      formData.phone ||
      formData.Phone ||
      formData["Captain Contact No."] ||
      formData["Contact"];
    const institution =
      formData.institution ||
      formData.Institution ||
      formData["Institution Name"] ||
      formData.college ||
      formData.College ||
      formData["College Address"];
    const city = formData.city || formData.City;

    if (!email || !name) {
      console.log("Missing fields - formData:", formData);
      console.log("Extracted - email:", email, "name:", name);
      return res.status(400).json({
        success: false,
        message: "Email and Name are required fields",
      });
    }

    // NOTE: Duplicate registration check REMOVED - users can register multiple times

    // Create registration with documents
    const registration = new Registration({
      eventId,
      eventName: event.name,
      formData,
      email: email.toLowerCase(),
      name,
      phone,
      institution,
      city,
      amount: event.registrationFee,
      status: "pending", // Single unified status
      documents: {
        permissionLetter: permissionLetter[0].path, // Cloudinary URL
        transactionReceipt: transactionReceipt[0].path, // Cloudinary URL
        captainIdCard: captainIdCard[0].path, // Cloudinary URL
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    await registration.save();

    // Send pending registration email (non-blocking)
    sendPendingRegistrationEmail({
      name: registration.name,
      eventName: registration.eventName,
      registrationNumber: registration.registrationNumber,
      email: registration.email,
      institution: registration.institution,
    }).catch((err) => {
      console.error("Failed to send pending registration email:", err.message);
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        registrationNumber: registration.registrationNumber,
        email: registration.email,
        eventName: registration.eventName,
        status: registration.status,
      },
    });
  } catch (error) {
    console.error("Create registration error:", error);

    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
      error: error.message,
    });
  }
};

// Create sports registration (simplified system - no Event model dependency)
export const createSportsRegistration = async (req, res) => {
  try {
    let {sportName, sportDetails, formData} = req.body;

    // Parse JSON strings from multipart/form-data
    if (typeof sportDetails === "string") {
      sportDetails = JSON.parse(sportDetails);
    }
    if (typeof formData === "string") {
      formData = JSON.parse(formData);
    }

    // Validate sport selection
    if (!sportName) {
      return res.status(400).json({
        success: false,
        message: "Please select a sport",
      });
    }

    // Validate document uploads (only transactionReceipt is required)
    if (!req.files || !req.files.transactionReceipt) {
      return res.status(400).json({
        success: false,
        message: "Transaction receipt (payment screenshot) is required",
      });
    }

    const {permissionLetter, transactionReceipt, captainIdCard} = req.files;

    // Extract common fields
    const email = formData.email?.toLowerCase();
    const name = formData.captain_name || formData.team_name;
    const phone = formData.captain_contact;
    const institution = formData.institution;
    const city = formData.city;

    // Validate essential fields
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Email and team/captain name are required",
      });
    }

    // NOTE: Duplicate registration check REMOVED - users can register multiple times for same sport
    // This allows team changes or re-registrations

    // Create a virtual eventId for sports (use sport name as identifier)
    const virtualEventId = new mongoose.Types.ObjectId();

    // Extract accommodation details
    const accommodationNeeded =
      formData.needs_accommodation || formData.need_accommodation || false;
    const numDays = accommodationNeeded ? formData.num_days || 0 : 0;
    const numPeople = accommodationNeeded ? formData.num_people || 0 : 0;
    const accommodationFee = accommodationNeeded
      ? formData.total_accommodation_fee || numDays * 200
      : 0;

    // Calculate registration fee based on sport and gender category
    const genderCategory =
      formData.gender_category ||
      sportDetails?.selectedGender ||
      sportDetails?.category ||
      null;
    const registrationFee = calculateSportFee(sportName, genderCategory);

    console.log(
      `Calculating fee for ${sportName} (${genderCategory}): ₹${registrationFee}`
    );

    // Create registration with documents
    const registration = new Registration({
      eventId: virtualEventId,
      eventName: sportName,
      formData: {
        ...formData,
        sportDetails, // Store sport-specific details
      },
      email,
      name,
      phone,
      institution,
      city,
      amount: registrationFee, // Calculated registration fee
      status: "pending", // Single unified status
      accommodation: {
        needed: accommodationNeeded,
        numDays: numDays,
        numPeople: numPeople,
        totalFee: accommodationFee,
      },
      documents: {
        permissionLetter: permissionLetter?.[0]?.path || null, // Optional
        transactionReceipt: transactionReceipt[0].path, // Required - Cloudinary URL
        captainIdCard: captainIdCard?.[0]?.path || null, // Optional
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    await registration.save();

    // Send confirmation email (non-blocking)
    sendPendingRegistrationEmail({
      name: registration.name,
      eventName: registration.eventName,
      registrationNumber: registration.registrationNumber,
      email: registration.email,
      institution: registration.institution,
    }).catch((err) => {
      console.error("Failed to send confirmation email:", err.message);
    });

    res.status(201).json({
      success: true,
      message: "Sports registration successful",
      data: {
        registrationNumber: registration.registrationNumber,
        email: registration.email,
        sportName: registration.eventName,
        status: registration.status,
        teamName: formData.team_name,
        captainName: formData.captain_name,
      },
    });
  } catch (error) {
    console.error("Create sports registration error:", error);

    res.status(500).json({
      success: false,
      message: "Sports registration failed. Please try again.",
      error: error.message,
    });
  }
};

// Get all registrations (with filters)
export const getAllRegistrations = async (req, res) => {
  try {
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

    const query = {};

    // Filter by status
    if (status) query.status = status;

    // Filter by event name (for sports filtering)
    if (eventName) query.eventName = eventName;

    // Filter by payment status
    if (paymentStatus) query.paymentStatus = paymentStatus;

    // Search across multiple fields
    if (search) {
      query.$or = [
        {name: {$regex: search, $options: "i"}},
        {email: {$regex: search, $options: "i"}},
        {phone: {$regex: search, $options: "i"}},
        {institution: {$regex: search, $options: "i"}},
        {registrationNumber: {$regex: search, $options: "i"}},
        {eventName: {$regex: search, $options: "i"}},
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
    console.error("Get all registrations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch registrations",
      error: error.message,
    });
  }
};

// Get all registrations for an event
export const getEventRegistrations = async (req, res) => {
  try {
    const {eventId} = req.params;
    const {
      page = 1,
      limit = 50,
      status,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {eventId};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        {name: {$regex: search, $options: "i"}},
        {email: {$regex: search, $options: "i"}},
        {phone: {$regex: search, $options: "i"}},
        {institution: {$regex: search, $options: "i"}},
        {registrationNumber: {$regex: search, $options: "i"}},
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const registrations = await Registration.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Registration.countDocuments(query);

    res.json({
      success: true,
      data: registrations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
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
    const registration = await Registration.findById(req.params.id).populate(
      "eventId",
      "name description eventDate venue",
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
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

// Update registration status
export const updateRegistrationStatus = async (req, res) => {
  try {
    const {status, notes} = req.body;

    const registration = await Registration.findById(req.params.id).populate(
      "eventId",
      "name eventDate venue",
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    const previousStatus = registration.status;
    registration.status = status;
    if (notes) registration.notes = notes;

    await registration.save();

    // Send approval email if status changed to confirmed
    if (status === "confirmed" && previousStatus !== "confirmed") {
      sendApprovedRegistrationEmail({
        name: registration.name,
        eventName: registration.eventName,
        registrationNumber: registration.registrationNumber,
        email: registration.email,
        institution: registration.institution,
        eventDate: registration.eventId?.eventDate,
        venue: registration.eventId?.venue,
      }).catch((err) => {
        console.error("Failed to send approval email:", err.message);
      });
    }

    res.json({
      success: true,
      message: "Registration status updated",
      data: registration,
    });
  } catch (error) {
    console.error("Update registration status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update registration status",
      error: error.message,
    });
  }
};

// Delete registration
export const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    await registration.deleteOne();

    res.json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error) {
    console.error("Delete registration error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete registration",
      error: error.message,
    });
  }
};

// Get analytics for an event
export const getEventAnalytics = async (req, res) => {
  try {
    const {eventId} = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const analytics = await Registration.getEventAnalytics(eventId);

    res.json({
      success: true,
      data: {
        eventName: event.name,
        eventDate: event.eventDate,
        registrationDeadline: event.registrationDeadline,
        maxParticipants: event.maxParticipants,
        ...analytics,
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
};

// Export registrations to CSV
export const exportRegistrations = async (req, res) => {
  try {
    const {eventId} = req.params;
    const {status} = req.query;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const filters = status ? {status} : {};
    const registrations = await Registration.getExportData(eventId, filters);

    if (registrations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No registrations found",
      });
    }

    // Prepare data for CSV
    const csvData = registrations.map((reg) => {
      const flatData = {
        "Registration Number": reg.registrationNumber,
        Name: reg.name,
        Email: reg.email,
        Phone: reg.phone || "N/A",
        Institution: reg.institution || "N/A",
        City: reg.city || "N/A",
        Status: reg.status,
        "Payment Status": reg.paymentStatus,
        Amount: reg.amount,
        "Registered At": new Date(reg.createdAt).toLocaleString(),
      };

      // Add custom fields
      if (reg.formData) {
        const formDataObj =
          reg.formData instanceof Map
            ? Object.fromEntries(reg.formData)
            : reg.formData;
        Object.entries(formDataObj).forEach(([key, value]) => {
          if (
            !["email", "name", "phone", "institution", "city"].includes(
              key.toLowerCase(),
            )
          ) {
            flatData[key] = value;
          }
        });
      }

      return flatData;
    });

    const parser = new Parser();
    const csv = parser.parse(csvData);

    const filename = `${event.name.replace(
      /\s+/g,
      "_",
    )}_registrations_${Date.now()}.csv`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    console.error("Export registrations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export registrations",
      error: error.message,
    });
  }
};

// Get registration by registration number (public)
export const getRegistrationByNumber = async (req, res) => {
  try {
    const {registrationNumber} = req.params;

    const registration = await Registration.findOne({registrationNumber})
      .populate("eventId", "name eventDate venue")
      .select("-userAgent -ipAddress");

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("Get registration by number error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch registration",
      error: error.message,
    });
  }
};

// Get overall registration statistics
export const getRegistrationStats = async (req, res) => {
  try {
    const stats = await Registration.aggregate([
      {
        $facet: {
          total: [{$count: "count"}],
          byStatus: [{$group: {_id: "$status", count: {$sum: 1}}}],
          byPaymentStatus: [
            {
              $group: {
                _id: "$paymentStatus",
                count: {$sum: 1},
                totalAmount: {$sum: "$amount"},
              },
            },
          ],
          recent: [
            {$sort: {createdAt: -1}},
            {$limit: 10},
            {
              $project: {
                name: 1,
                email: 1,
                eventName: 1,
                createdAt: 1,
                status: 1,
              },
            },
          ],
          topEvents: [
            {
              $group: {
                _id: "$eventId",
                eventName: {$first: "$eventName"},
                count: {$sum: 1},
              },
            },
            {$sort: {count: -1}},
            {$limit: 5},
          ],
        },
      },
    ]);

    res.json({
      success: true,
      data: stats[0],
    });
  } catch (error) {
    console.error("Get registration stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
};
