import express from "express";

import { createCategory, deleteCategory, getCategories, getCategoryBySlug, updateCategory } from "../controllers/category/category.controller.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);

// Admin only
router.post("/", protect, authorizeRoles("admin", "superadmin"), createCategory);
router.put("/:id", protect, authorizeRoles("admin", "superadmin"), updateCategory);
router.delete("/:id", protect, authorizeRoles("admin", "superadmin"), deleteCategory);

export default router;
