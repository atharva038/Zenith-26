import express from "express";
import * as eventController from "../controllers/event.controller.js";
import {verifyToken, isAdmin} from "../middleware/auth.middleware.js";

const router = express.Router();
// Public routes
router.get("/public", eventController.getPublicEvents);
router.get("/public/:id", eventController.getEventById);

// Protected admin routes
router.use(verifyToken);
router.use(isAdmin);

// Event CRUD
router.post("/", eventController.createEvent);
router.get("/", eventController.getAllEvents);
router.get("/stats", eventController.getEventStats);
router.get("/:id", eventController.getEventById);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);
router.patch("/:id/toggle-status", eventController.toggleEventStatus);

export default router;
