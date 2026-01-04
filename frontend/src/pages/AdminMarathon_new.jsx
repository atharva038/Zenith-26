import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import api from "../config/api";
import AdminLayout from "../components/AdminLayout";

// Copy everything from old AdminMarathon EXCEPT imports, sidebarOpen state, handleLogout, and the return statement wrapper
