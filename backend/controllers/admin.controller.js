import Admin from "../models/Admin.js";
import Registration from "../models/Registration.js";

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const totalAdmins = await Admin.countDocuments();
    const activeAdmins = await Admin.countDocuments({isActive: true});
    const recentAdmins = await Admin.find()
      .sort({createdAt: -1})
      .limit(5)
      .select("-password");

    // Get registration fee collection stats for confirmed payments
    const registrationStats = await Registration.aggregate([
      {
        $facet: {
          totalRegistrations: [{$count: "count"}],
          confirmedRegistrations: [
            {$match: {status: "confirmed"}},
            {$count: "count"},
          ],
          pendingRegistrations: [
            {$match: {status: "pending"}},
            {$count: "count"},
          ],
          cancelledRegistrations: [
            {$match: {status: "cancelled"}},
            {$count: "count"},
          ],
          feeCollection: [
            {$match: {status: "confirmed"}},
            {
              $group: {
                _id: null,
                totalRegistrationFee: {$sum: "$amount"},
                totalAccommodationFee: {$sum: "$accommodation.totalFee"},
              },
            },
          ],
        },
      },
    ]);

    const regStats = registrationStats[0] || {};
    const feeData = regStats.feeCollection?.[0] || {};

    res.json({
      success: true,
      data: {
        stats: {
          totalAdmins,
          activeAdmins,
          inactiveAdmins: totalAdmins - activeAdmins,
          // Registration stats
          totalRegistrations: regStats.totalRegistrations?.[0]?.count || 0,
          confirmedRegistrations:
            regStats.confirmedRegistrations?.[0]?.count || 0,
          pendingRegistrations: regStats.pendingRegistrations?.[0]?.count || 0,
          cancelledRegistrations:
            regStats.cancelledRegistrations?.[0]?.count || 0,
          // Fee collection (confirmed payments only)
          totalRegistrationFee: feeData.totalRegistrationFee || 0,
          totalAccommodationFee: feeData.totalAccommodationFee || 0,
          totalFeeCollected:
            (feeData.totalRegistrationFee || 0) +
            (feeData.totalAccommodationFee || 0),
        },
        recentAdmins,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
    });
  }
};

// @desc    Get all admins
// @route   GET /api/admin/admins
// @access  Private
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password").sort({createdAt: -1});

    res.json({
      success: true,
      data: {
        admins,
        count: admins.length,
      },
    });
  } catch (error) {
    console.error("Get admins error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching admins",
    });
  }
};

// @desc    Delete admin
// @route   DELETE /api/admin/admins/:id
// @access  Private
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Prevent deleting yourself
    if (admin._id.toString() === req.admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    await admin.deleteOne();

    res.json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("Delete admin error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting admin",
    });
  }
};

// @desc    Get players needing accommodation (excluding cricket, no duplicate phone numbers)
// @route   GET /api/admin/accommodation-list
// @access  Private
export const getAccommodationList = async (req, res) => {
  try {
    // Get all registrations with accommodation needs (excluding cricket)
    const registrations = await Registration.find({
      "accommodation.needed": true,
      status: { $ne: "cancelled" },
      eventName: { $not: /cricket/i }
    }).sort({ createdAt: 1 });

    // Map to extract all individual players
    const allPlayers = [];
    const phoneMap = new Map(); // Track unique phone numbers

    for (const reg of registrations) {
      // Extract team members from formData
      let teamMembers = [];
      
      if (reg.formData) {
        // Try to get team_members from Map or object
        const teamMembersData = reg.formData.get ? reg.formData.get('team_members') : reg.formData.team_members;
        
        if (teamMembersData) {
          // If it's a string (JSON), parse it
          if (typeof teamMembersData === 'string') {
            try {
              teamMembers = JSON.parse(teamMembersData);
            } catch (e) {
              console.error('Failed to parse team members:', e);
            }
          } else if (Array.isArray(teamMembersData)) {
            teamMembers = teamMembersData;
          }
        }
      }

      // If team members exist, add each player individually
      if (teamMembers && teamMembers.length > 0) {
        for (const member of teamMembers) {
          const phone = member.contact || member.phone;
          const name = member.name;
          
          if (!phone || !name) continue;
          
          // Skip if phone number already exists
          if (phoneMap.has(phone)) continue;
          
          phoneMap.set(phone, true);
          allPlayers.push({
            registrationId: reg._id,
            name: name,
            email: reg.email, // Registration email
            phone: phone,
            institution: reg.institution,
            city: reg.city,
            eventName: reg.eventName,
            status: reg.status,
            numDays: reg.accommodation?.numDays || 0,
            numPeople: reg.accommodation?.numPeople || 0,
            accommodationFee: reg.accommodation?.totalFee || 0,
            registrationDate: reg.createdAt,
            registrationNumber: reg.registrationNumber
          });
        }
      } else {
        // Solo registration - add captain/player
        const phone = reg.phone;
        const name = reg.name;
        
        if (phone && name && !phoneMap.has(phone)) {
          phoneMap.set(phone, true);
          allPlayers.push({
            registrationId: reg._id,
            name: name,
            email: reg.email,
            phone: phone,
            institution: reg.institution,
            city: reg.city,
            eventName: reg.eventName,
            status: reg.status,
            numDays: reg.accommodation?.numDays || 0,
            numPeople: reg.accommodation?.numPeople || 0,
            accommodationFee: reg.accommodation?.totalFee || 0,
            registrationDate: reg.createdAt,
            registrationNumber: reg.registrationNumber
          });
        }
      }
    }

    // Sort by name
    allPlayers.sort((a, b) => a.name.localeCompare(b.name));

    // Calculate summary statistics
    const totalPlayers = allPlayers.length;
    const totalDays = allPlayers.reduce((sum, player) => sum + (player.numDays || 0), 0);
    const totalPeople = allPlayers.reduce((sum, player) => sum + (player.numPeople || 0), 0);
    const rawTotal = allPlayers.reduce((sum, player) => sum + (player.accommodationFee || 0), 0);
    const totalAccommodationFee = rawTotal - 20000; // Total fee = total - 20k

    res.json({
      success: true,
      data: {
        players: allPlayers,
        summary: {
          totalPlayers,
          totalDays,
          totalPeople,
          totalAccommodationFee,
          confirmedPlayers: allPlayers.filter(p => p.status === 'confirmed').length,
          pendingPlayers: allPlayers.filter(p => p.status === 'pending').length
        }
      }
    });
  } catch (error) {
    console.error("Get accommodation list error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching accommodation list",
      error: error.message
    });
  }
};
