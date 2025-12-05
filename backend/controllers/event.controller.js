import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

// Create new event
export const createEvent = async (req, res) => {
  try {
    // Check if an event already exists for this sport category
    const existingEvent = await Event.findOne({category: req.body.category});

    if (existingEvent) {
      return res.status(400).json({
        success: false,
        message: `An event for ${req.body.category} already exists. Only one event per sport is allowed.`,
        existingEvent: {
          id: existingEvent._id,
          name: existingEvent.name,
        },
      });
    }

    const eventData = {
      ...req.body,
      createdBy: req.admin._id,
    };

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};

// Get all events (with filters)
export const getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      isActive,
      isPublished,
      search,
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (isPublished !== undefined) query.isPublished = isPublished === "true";
    if (search) {
      query.$or = [
        {name: {$regex: search, $options: "i"}},
        {description: {$regex: search, $options: "i"}},
      ];
    }

    const events = await Event.find(query)
      .populate("createdBy", "username email")
      .sort({createdAt: -1})
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Event.countDocuments(query);

    // Add registration counts
    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const regCount = await Registration.countDocuments({
          eventId: event._id,
        });
        return {
          ...event.toObject(),
          registrationCount: regCount,
        };
      })
    );

    res.json({
      success: true,
      data: eventsWithCounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "username email"
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const registrationCount = await Registration.countDocuments({
      eventId: event._id,
    });

    res.json({
      success: true,
      data: {
        ...event.toObject(),
        registrationCount,
      },
    });
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: error.message,
    });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // If category is being changed, check if another event exists for the new category
    if (req.body.category && req.body.category !== event.category) {
      const existingEvent = await Event.findOne({
        category: req.body.category,
        _id: {$ne: req.params.id}, // Exclude current event
      });

      if (existingEvent) {
        return res.status(400).json({
          success: false,
          message: `An event for ${req.body.category} already exists. Only one event per sport is allowed.`,
          existingEvent: {
            id: existingEvent._id,
            name: existingEvent.name,
          },
        });
      }
    }

    Object.assign(event, req.body);
    event.updatedBy = req.admin._id;
    await event.save();

    res.json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if there are registrations
    const registrationCount = await Registration.countDocuments({
      eventId: event._id,
    });

    if (registrationCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete event with ${registrationCount} registrations. Please archive it instead.`,
      });
    }

    await event.deleteOne();

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
};

// Toggle event active status
export const toggleEventStatus = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    event.isActive = !event.isActive;
    event.updatedBy = req.admin._id;
    await event.save();

    res.json({
      success: true,
      message: `Event ${
        event.isActive ? "activated" : "deactivated"
      } successfully`,
      data: event,
    });
  } catch (error) {
    console.error("Toggle event status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle event status",
      error: error.message,
    });
  }
};

// Get public events (active and published only)
export const getPublicEvents = async (req, res) => {
  try {
    const {category, search} = req.query;

    const query = {
      isActive: true,
      isPublished: true,
    };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        {name: {$regex: search, $options: "i"}},
        {description: {$regex: search, $options: "i"}},
      ];
    }

    const events = await Event.find(query)
      .select("-createdBy -updatedBy")
      .sort({eventDate: 1});

    // Add registration counts and availability
    const eventsWithDetails = await Promise.all(
      events.map(async (event) => {
        const regCount = await Registration.countDocuments({
          eventId: event._id,
          status: {$in: ["confirmed", "pending"]},
        });

        const isOpen = event.isRegistrationOpen();
        const isFull =
          event.maxParticipants && regCount >= event.maxParticipants;

        return {
          ...event.toObject(),
          registrationCount: regCount,
          spotsLeft: event.maxParticipants
            ? event.maxParticipants - regCount
            : null,
          isRegistrationOpen: isOpen && !isFull,
          isFull,
        };
      })
    );

    res.json({
      success: true,
      data: eventsWithDetails,
    });
  } catch (error) {
    console.error("Get public events error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};

// Get event statistics
export const getEventStats = async (req, res) => {
  try {
    const stats = await Event.aggregate([
      {
        $facet: {
          total: [{$count: "count"}],
          active: [{$match: {isActive: true}}, {$count: "count"}],
          published: [{$match: {isPublished: true}}, {$count: "count"}],
          byCategory: [{$group: {_id: "$category", count: {$sum: 1}}}],
          upcoming: [
            {$match: {eventDate: {$gte: new Date()}}},
            {$count: "count"},
          ],
        },
      },
    ]);

    const totalRegistrations = await Registration.countDocuments();

    res.json({
      success: true,
      data: {
        ...stats[0],
        totalRegistrations,
      },
    });
  } catch (error) {
    console.error("Get event stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
};
