import Marathon from "../models/Marathon.js";
import { Parser } from "json2csv";
import { sendEmail } from "../config/email.js";

// Email template for marathon registration confirmation
const getMarathonConfirmationEmail = (registration) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Marathon Registration Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0604;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background: linear-gradient(135deg, #1a0f08 0%, #0a0604 100%); border-radius: 20px; border: 2px solid #ff8b1f; box-shadow: 0 20px 60px rgba(255, 139, 31, 0.2);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center; border-bottom: 1px solid rgba(255, 139, 31, 0.2);">
              <h1 style="margin: 0; font-size: 32px; color: #ff8b1f; letter-spacing: 2px;">🏃 ZENITH 2026</h1>
              <p style="margin: 10px 0 0; color: #ffb36a; font-size: 16px;">Marathon Registration</p>
            </td>
          </tr>
          
          <!-- Success Badge -->
          <tr>
            <td style="padding: 30px; text-align: center;">
              <div style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #10b981 100%); border-radius: 50%; width: 80px; height: 80px; line-height: 80px; font-size: 40px;">
                ✓
              </div>
              <h2 style="margin: 20px 0 10px; font-size: 28px; color: #22c55e;">Registration Confirmed! 🎉</h2>
              <p style="margin: 0; color: #9ca3af; font-size: 16px;">Your payment has been verified successfully</p>
            </td>
          </tr>
          
          <!-- Registration Details -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table role="presentation" style="width: 100%; background-color: rgba(0,0,0,0.4); border-radius: 12px; border: 1px solid rgba(255, 139, 31, 0.2);">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #ffb36a; font-size: 18px;">📋 Your Registration Details</h3>
                    
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">Registration No:</td>
                        <td style="padding: 8px 0; color: #ff8b1f; font-weight: bold; font-size: 16px; text-align: right; font-family: monospace;">${registration.registrationNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">Name:</td>
                        <td style="padding: 8px 0; color: #ffffff; font-weight: 600; text-align: right;">${registration.fullName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">Email:</td>
                        <td style="padding: 8px 0; color: #ffffff; text-align: right;">${registration.email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">Phone:</td>
                        <td style="padding: 8px 0; color: #ffffff; text-align: right;">${registration.phone}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">Event:</td>
                        <td style="padding: 8px 0; color: #fb923c; font-weight: 600; text-align: right;">5K Marathon</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">Amount Paid:</td>
                        <td style="padding: 8px 0; color: #22c55e; font-weight: bold; text-align: right;">₹99</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Important Info -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table role="presentation" style="width: 100%; background-color: rgba(59, 130, 246, 0.1); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.3);">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #60a5fa; font-size: 16px;">📌 Important Information</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #d1d5db; font-size: 14px; line-height: 1.8;">
                      <li>Please carry a valid ID proof on the event day</li>
                      <li>Report to the venue at least 30 minutes before the start time</li>
                      <li>Your BIB number will be provided at the venue</li>
                      <li>Stay hydrated and follow safety guidelines</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Contact Info -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table role="presentation" style="width: 100%; background-color: rgba(168, 85, 247, 0.1); border-radius: 12px; border: 1px solid rgba(168, 85, 247, 0.3);">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #c084fc; font-size: 16px;">📞 For Queries, Contact:</h3>
                    <p style="margin: 0 0 8px; color: #d1d5db; font-size: 14px;">Sagar Ubale: <a href="tel:+919876543210" style="color: #c084fc; text-decoration: none;">+91 98765 43210</a></p>
                    <p style="margin: 0; color: #d1d5db; font-size: 14px;">Atharva Joshi: <a href="tel:+919123456789" style="color: #c084fc; text-decoration: none;">+91 91234 56789</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; border-top: 1px solid rgba(255, 139, 31, 0.2);">
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 14px;">See you at the marathon! 🏃‍♂️🏆</p>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">ZENITH 2026 - SGGS Institute of Engineering & Technology</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// Email template for marathon registration rejection
const getMarathonRejectionEmail = (registration) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Marathon Registration Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0604;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background: linear-gradient(135deg, #1a0f08 0%, #0a0604 100%); border-radius: 20px; border: 2px solid #ff8b1f; box-shadow: 0 20px 60px rgba(255, 139, 31, 0.2);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center; border-bottom: 1px solid rgba(255, 139, 31, 0.2);">
              <h1 style="margin: 0; font-size: 32px; color: #ff8b1f; letter-spacing: 2px;">🏃 ZENITH 2026</h1>
              <p style="margin: 10px 0 0; color: #ffb36a; font-size: 16px;">Marathon Registration</p>
            </td>
          </tr>
          
          <!-- Status Badge -->
          <tr>
            <td style="padding: 30px; text-align: center;">
              <div style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 50%; width: 80px; height: 80px; line-height: 80px; font-size: 40px;">
                ✕
              </div>
              <h2 style="margin: 20px 0 10px; font-size: 28px; color: #ef4444;">Registration Cancelled</h2>
              <p style="margin: 0; color: #9ca3af; font-size: 16px;">We couldn't verify your payment</p>
            </td>
          </tr>
          
          <!-- Registration Details -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table role="presentation" style="width: 100%; background-color: rgba(0,0,0,0.4); border-radius: 12px; border: 1px solid rgba(255, 139, 31, 0.2);">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #ffb36a; font-size: 18px;">📋 Registration Details</h3>
                    
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">Registration No:</td>
                        <td style="padding: 8px 0; color: #ff8b1f; font-weight: bold; font-size: 16px; text-align: right; font-family: monospace;">${registration.registrationNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">Name:</td>
                        <td style="padding: 8px 0; color: #ffffff; font-weight: 600; text-align: right;">${registration.fullName}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- What to do -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table role="presentation" style="width: 100%; background-color: rgba(251, 191, 36, 0.1); border-radius: 12px; border: 1px solid rgba(251, 191, 36, 0.3);">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #fbbf24; font-size: 16px;">⚠️ What to do?</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #d1d5db; font-size: 14px; line-height: 1.8;">
                      <li>Your payment screenshot could not be verified</li>
                      <li>Please ensure you uploaded a clear screenshot</li>
                      <li>You can register again with valid payment proof</li>
                      <li>Contact us if you believe this is an error</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Contact Info -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table role="presentation" style="width: 100%; background-color: rgba(168, 85, 247, 0.1); border-radius: 12px; border: 1px solid rgba(168, 85, 247, 0.3);">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; color: #c084fc; font-size: 16px;">📞 For Queries, Contact:</h3>
                    <p style="margin: 0 0 8px; color: #d1d5db; font-size: 14px;">Sagar Ubale: <a href="tel:+919876543210" style="color: #c084fc; text-decoration: none;">+91 98765 43210</a></p>
                    <p style="margin: 0; color: #d1d5db; font-size: 14px;">Atharva Joshi: <a href="tel:+919123456789" style="color: #c084fc; text-decoration: none;">+91 91234 56789</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; border-top: 1px solid rgba(255, 139, 31, 0.2);">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">ZENITH 2026 - SGGS Institute of Engineering & Technology</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// @desc    Register for marathon
// @route   POST /api/marathon/register
// @access  Public
export const registerMarathon = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      age,
      gender,
      college,
      tshirtSize,
      emergencyContact,
      medicalConditions,
      paymentDetails,
    } = req.body;

    // Check if user already registered with this email
    const existingRegistration = await Marathon.findOne({ email });
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "You have already registered for the marathon",
      });
    }

    // Create marathon registration
    const registration = await Marathon.create({
      fullName,
      email,
      phone,
      age,
      gender,
      college,
      tshirtSize,
      emergencyContact,
      medicalConditions,
      paymentDetails,
    });

    res.status(201).json({
      success: true,
      message: "Marathon registration successful!",
      data: {
        registrationNumber: registration.registrationNumber,
        fullName: registration.fullName,
        email: registration.email,
      },
    });
  } catch (error) {
    console.error("Marathon registration error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

// @desc    Get all marathon registrations (Admin)
// @route   GET /api/marathon/registrations
// @access  Private/Admin
export const getAllRegistrations = async (req, res) => {
  try {
    const { status, search, gender } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (gender) filter.gender = gender;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { registrationNumber: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const registrations = await Marathon.find(filter).sort({ createdAt: -1 });

    // Get statistics
    const stats = {
      total: await Marathon.countDocuments(),
      pending: await Marathon.countDocuments({ status: "pending" }),
      confirmed: await Marathon.countDocuments({ status: "confirmed" }),
      cancelled: await Marathon.countDocuments({ status: "cancelled" }),
      byGender: {
        male: await Marathon.countDocuments({ gender: "Male" }),
        female: await Marathon.countDocuments({ gender: "Female" }),
        other: await Marathon.countDocuments({ gender: "Other" }),
      },
    };

    res.json({
      success: true,
      count: registrations.length,
      stats,
      data: registrations,
    });
  } catch (error) {
    console.error("Get registrations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch registrations",
    });
  }
};

// @desc    Get single marathon registration
// @route   GET /api/marathon/registrations/:id
// @access  Private/Admin
export const getRegistrationById = async (req, res) => {
  try {
    const registration = await Marathon.findById(req.params.id);

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
    });
  }
};

// @desc    Update marathon registration status
// @route   PUT /api/marathon/registrations/:id
// @access  Private/Admin
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const registration = await Marathon.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    const previousStatus = registration.status;

    if (status) {
      registration.status = status;
      
      // When admin confirms registration, also verify payment
      if (status === "confirmed") {
        if (registration.paymentDetails) {
          registration.paymentDetails.paymentStatus = "verified";
        }
      }
      
      // When admin cancels/rejects registration, mark payment as failed
      if (status === "cancelled") {
        if (registration.paymentDetails) {
          registration.paymentDetails.paymentStatus = "failed";
        }
      }
    }

    // Handle payment status update separately
    if (paymentStatus) {
      if (!registration.paymentDetails) {
        registration.paymentDetails = {};
      }
      registration.paymentDetails.paymentStatus = paymentStatus;
    }

    await registration.save();

    // Send email notification when status changes to confirmed or cancelled
    let emailSent = false;
    if (status && status !== previousStatus) {
      try {
        if (status === "confirmed") {
          // Send confirmation email
          const emailResult = await sendEmail({
            to: registration.email,
            subject: "🎉 ZENITH Marathon 2026 - Registration Confirmed!",
            html: getMarathonConfirmationEmail(registration),
            text: `Congratulations ${registration.fullName}! Your marathon registration (${registration.registrationNumber}) has been confirmed. See you at the event!`,
          });
          emailSent = emailResult.success;
          console.log(`✅ Confirmation email sent to ${registration.email}: ${emailResult.success}`);
        } else if (status === "cancelled") {
          // Send rejection email
          const emailResult = await sendEmail({
            to: registration.email,
            subject: "ZENITH Marathon 2026 - Registration Update",
            html: getMarathonRejectionEmail(registration),
            text: `Dear ${registration.fullName}, your marathon registration (${registration.registrationNumber}) could not be verified. Please contact us for more information.`,
          });
          emailSent = emailResult.success;
          console.log(`📧 Cancellation email sent to ${registration.email}: ${emailResult.success}`);
        }
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the request if email fails
      }
    }

    res.json({
      success: true,
      message: "Registration updated successfully",
      emailSent,
      data: registration,
    });
  } catch (error) {
    console.error("Update registration error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update registration",
    });
  }
};

// @desc    Delete marathon registration
// @route   DELETE /api/marathon/registrations/:id
// @access  Private/Admin
export const deleteRegistration = async (req, res) => {
  try {
    const registration = await Marathon.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    await Marathon.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error) {
    console.error("Delete registration error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete registration",
    });
  }
};

// @desc    Export marathon registrations to CSV
// @route   GET /api/marathon/export
// @access  Private/Admin
export const exportRegistrations = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const registrations = await Marathon.find(filter).sort({ createdAt: -1 });

    if (registrations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No registrations found to export",
      });
    }

    // Prepare data for CSV
    const data = registrations.map((reg) => ({
      "Registration Number": reg.registrationNumber,
      "Full Name": reg.fullName,
      Email: reg.email,
      Phone: reg.phone,
      Age: reg.age,
      Gender: reg.gender,
      College: reg.college,
      "T-Shirt Size": reg.tshirtSize || "N/A",
      "Emergency Contact Name": reg.emergencyContact.name,
      "Emergency Contact Phone": reg.emergencyContact.phone,
      "Medical Conditions": reg.medicalConditions || "None",
      Status: reg.status,
      "Payment Status": reg.paymentDetails?.paymentStatus || "pending",
      "Registered On": new Date(reg.createdAt).toLocaleString("en-IN"),
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=marathon-registrations-${Date.now()}.csv`
    );
    res.send(csv);
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export registrations",
    });
  }
};

// @desc    Get marathon statistics
// @route   GET /api/marathon/stats
// @access  Private/Admin
export const getMarathonStats = async (req, res) => {
  try {
    const stats = {
      total: await Marathon.countDocuments(),
      pending: await Marathon.countDocuments({ status: "pending" }),
      confirmed: await Marathon.countDocuments({ status: "confirmed" }),
      cancelled: await Marathon.countDocuments({ status: "cancelled" }),
      byGender: {
        Male: await Marathon.countDocuments({ gender: "Male" }),
        Female: await Marathon.countDocuments({ gender: "Female" }),
        Other: await Marathon.countDocuments({ gender: "Other" }),
      },
      recentRegistrations: await Marathon.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("fullName email registrationNumber createdAt"),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
    });
  }
};

// Mark T-shirt as distributed
export const markTshirtDistributed = async (req, res) => {
  try {
    const { id } = req.params;
    // const { distributedBy } = req.body; // COMMENTED OUT - Team member tracking

    // COMMENTED OUT - Team member name validation
    // if (!distributedBy || !distributedBy.trim()) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Team member name is required",
    //   });
    // }

    const registration = await Marathon.findById(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Only allow for confirmed registrations
    if (registration.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Can only distribute T-shirts for confirmed registrations",
      });
    }

    // Check if already distributed
    if (registration.tshirtDistributed) {
      return res.status(400).json({
        success: false,
        message: "T-shirt already marked as distributed",
      });
    }

    // Update T-shirt distribution status
    registration.tshirtDistributed = true;
    // registration.tshirtDistributedBy = distributedBy.trim(); // COMMENTED OUT
    registration.tshirtDistributedAt = new Date();

    await registration.save();

    res.status(200).json({
      success: true,
      message: "T-shirt marked as distributed",
      data: registration,
    });
  } catch (error) {
    console.error("Error marking T-shirt distributed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update T-shirt distribution status",
      error: error.message,
    });
  }
};

// Undo T-shirt distribution (in case of mistake)
export const undoTshirtDistribution = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await Marathon.findById(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    if (!registration.tshirtDistributed) {
      return res.status(400).json({
        success: false,
        message: "T-shirt is not marked as distributed",
      });
    }

    // Reset distribution status
    registration.tshirtDistributed = false;
    registration.tshirtDistributedBy = null;
    registration.tshirtDistributedAt = null;

    await registration.save();

    res.status(200).json({
      success: true,
      message: "T-shirt distribution undone",
      data: registration,
    });
  } catch (error) {
    console.error("Error undoing T-shirt distribution:", error);
    res.status(500).json({
      success: false,
      message: "Failed to undo T-shirt distribution",
      error: error.message,
    });
  }
};

// Get T-shirt distribution statistics
export const getTshirtDistributionStats = async (req, res) => {
  try {
    const totalConfirmed = await Marathon.countDocuments({
      status: "confirmed",
    });

    const distributed = await Marathon.countDocuments({
      status: "confirmed",
      tshirtDistributed: true,
    });

    const pending = totalConfirmed - distributed;

    // Get distribution by team member
    const distributionByMember = await Marathon.aggregate([
      {
        $match: {
          status: "confirmed",
          tshirtDistributed: true,
        },
      },
      {
        $group: {
          _id: "$tshirtDistributedBy",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalConfirmed,
        distributed,
        pending,
        percentage: totalConfirmed > 0 ? ((distributed / totalConfirmed) * 100).toFixed(1) : 0,
        distributionByMember,
      },
    });
  } catch (error) {
    console.error("Error getting T-shirt distribution stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get T-shirt distribution statistics",
      error: error.message,
    });
  }
};
