import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import {Parser} from "json2csv";

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

    // Check for duplicate registration
    const existingRegistration = await Registration.findOne({eventId, email});
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "You have already registered for this event",
        registrationNumber: existingRegistration.registrationNumber,
      });
    }

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
      paymentStatus: event.registrationFee > 0 ? "pending" : "not_required",
      documents: {
        permissionLetter: permissionLetter[0].path,
        transactionReceipt: transactionReceipt[0].path,
        captainIdCard: captainIdCard[0].path,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    await registration.save();

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

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already registered for this event",
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed",
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
      "name description eventDate venue"
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

    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    registration.status = status;
    if (notes) registration.notes = notes;

    await registration.save();

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
              key.toLowerCase()
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
      "_"
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
