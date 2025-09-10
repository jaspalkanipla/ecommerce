import express from "express";
import {
  createSubcategory,
  getSubcategories,
  getSubcategoryBySlug,
  updateSubcategory,
  deleteSubcategory
} from "../controllers/subcategory/subcategory.controller.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getSubcategories);
router.get("/:slug", getSubcategoryBySlug);

// Admin
router.post("/", protect, authorizeRoles("admin", "superadmin"), createSubcategory);
router.put("/:id", protect, authorizeRoles("admin", "superadmin"), updateSubcategory);
router.delete("/:id", protect, authorizeRoles("admin", "superadmin"), deleteSubcategory);

export default router;
