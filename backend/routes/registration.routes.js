import express from "express";
import * as registrationController from "../controllers/registration.controller.js";
import {verifyToken, isAdmin} from "../middleware/auth.middleware.js";
import {uploadRegistrationDocuments} from "../middleware/cloudinaryUpload.middleware.js";

const router = express.Router();
// Public routes
router.post(
  "/",
  uploadRegistrationDocuments,
  registrationController.createRegistration
);
// Sports registration (new simplified system)
router.post(
  "/sports",
  uploadRegistrationDocuments,
  registrationController.createSportsRegistration
);
router.get(
  "/number/:registrationNumber",
  registrationController.getRegistrationByNumber
);

// Protected admin routes
router.use(verifyToken);
router.use(isAdmin);

router.get("/", registrationController.getAllRegistrations);
router.get("/stats", registrationController.getRegistrationStats);
router.get("/event/:eventId", registrationController.getEventRegistrations);
router.get(
  "/event/:eventId/analytics",
  registrationController.getEventAnalytics
);
router.get(
  "/event/:eventId/export",
  registrationController.exportRegistrations
);
router.get("/:id", registrationController.getRegistrationById);
router.patch("/:id/status", registrationController.updateRegistrationStatus);
router.delete("/:id", registrationController.deleteRegistration);

export default router;
