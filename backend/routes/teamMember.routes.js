import express from "express";
import {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
  permanentlyDeleteTeamMember,
  clearAllTeamData,
} from "../controllers/teamMember.controller.js";
import {authMiddleware, isAdmin} from "../middleware/auth.middleware.js";
import {uploadTeamMemberPhoto} from "../middleware/cloudinaryUpload.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllTeamMembers);
router.get("/:id", getTeamMemberById);

// Protected routes (Admin only) - Order matters! Specific routes before parameterized ones
router.delete("/clear-all-data", authMiddleware, isAdmin, clearAllTeamData);

// Public route - Anyone can add team members
router.post("/", uploadTeamMemberPhoto, createTeamMember);

router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  uploadTeamMemberPhoto,
  updateTeamMember
);
router.delete("/:id", authMiddleware, isAdmin, deleteTeamMember);
router.delete(
  "/:id/permanent",
  authMiddleware,
  isAdmin,
  permanentlyDeleteTeamMember
);

export default router;
