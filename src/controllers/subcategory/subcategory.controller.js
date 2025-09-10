import Subcategory from "../../models/subcategory.model.js";
import Category from "../../models/category.model.js";
import { errorResponse, successResponse } from "../../utils/responseHandler.js";

// Create Subcategory (Admin only)
export const createSubcategory = async (req, res, next) => {
  try {
    const { name, description, category } = req.body;

    if (!name || !category) {
      return errorResponse(res, "Subcategory name and parent category are required.", 400);
    }

    const parentCategory = await Category.findById(category);
    if (!parentCategory || parentCategory.isDeleted) {
      return errorResponse(res, "Parent category not found", 404);
    }

    const existing = await Subcategory.findOne({ name, category });
    if (existing) {
      return errorResponse(res, "Subcategory already exists in this category", 400);
    }

    const subcategory = await Subcategory.create({ name, description, category });
    return successResponse(res, "Subcategory created successfully", subcategory, 201);
  } catch (err) {
    next(err);
  }
};

// Get all Subcategories (public)
export const getSubcategories = async (req, res, next) => {
  try {
    const subcategories = await Subcategory.find({ isDeleted: false })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return successResponse(res, "Subcategories fetched successfully", subcategories);
  } catch (err) {
    next(err);
  }
};

// Get single Subcategory by slug (public)
export const getSubcategoryBySlug = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findOne({ slug: req.params.slug, isDeleted: false })
      .populate("category", "name slug");

    if (!subcategory) return errorResponse(res, "Subcategory not found", 404);

    return successResponse(res, "Subcategory fetched successfully", subcategory);
  } catch (err) {
    next(err);
  }
};

// Update Subcategory (Admin only)
export const updateSubcategory = async (req, res, next) => {
  try {
    const { name, description, category, isActive } = req.body;

    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory || subcategory.isDeleted) {
      return errorResponse(res, "Subcategory not found", 404);
    }

    if (category) {
      const parentCategory = await Category.findById(category);
      if (!parentCategory || parentCategory.isDeleted) {
        return errorResponse(res, "Parent category not found", 404);
      }
      subcategory.category = category;
    }

    subcategory.name = name || subcategory.name;
    subcategory.description = description || subcategory.description;
    subcategory.isActive = isActive !== undefined ? isActive : subcategory.isActive;

    await subcategory.save();

    return successResponse(res, "Subcategory updated successfully", subcategory);
  } catch (err) {
    next(err);
  }
};

// Soft delete Subcategory (Admin only)
export const deleteSubcategory = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory || subcategory.isDeleted) {
      return errorResponse(res, "Subcategory not found", 404);
    }

    subcategory.isDeleted = true;
    await subcategory.save();

    return successResponse(res, "Subcategory deleted successfully", null);
  } catch (err) {
    next(err);
  }
};
