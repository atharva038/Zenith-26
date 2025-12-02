import Admin from "../models/Admin.js";

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

    res.json({
      success: true,
      data: {
        stats: {
          totalAdmins,
          activeAdmins,
          inactiveAdmins: totalAdmins - activeAdmins,
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
