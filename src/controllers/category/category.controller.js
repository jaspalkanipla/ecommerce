import Category from "../../models/category.model.js";
import { errorResponse, successResponse } from "../../utils/responseHandler.js";

// ✅ Create category (Admin only)
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Validation: name required
    if (!name || name.trim() === "") {
      return errorResponse(res, "Category name is required.", 400);
    }

    // Duplicate check (case-insensitive)
    const existing = await Category.findOne({
      name: { $regex: new RegExp("^" + name + "$", "i") },
      isDeleted: false,
    });

    if (existing) {
      return errorResponse(res, "Category already exists.", 400);
    }

    const category = await Category.create({
      name: name.trim(),
      description: description?.trim() || "",
    });

    return successResponse(res, "Category created successfully.", category, 201);
  } catch (err) {
    next(err);
  }
};

// ✅ Get all categories (public)
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .select("-__v"); // cleaner response

    return successResponse(res, "Categories fetched successfully.", categories);
  } catch (err) {
    next(err);
  }
};

// ✅ Get single category by slug (public)
export const getCategoryBySlug = async (req, res, next) => {
  try {
    if (!req.params.slug) {
      return errorResponse(res, "Slug is required.", 400);
    }

    const category = await Category.findOne({
      slug: req.params.slug,
      isDeleted: false,
    });

    if (!category) return errorResponse(res, "Category not found.", 404);

    return successResponse(res, "Category fetched successfully.", category);
  } catch (err) {
    next(err);
  }
};

// ✅ Update category (Admin only)
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, isActive } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category || category.isDeleted) {
      return errorResponse(res, "Category not found.", 404);
    }

    if (name && name.trim() === "") {
      return errorResponse(res, "Category name cannot be empty.", 400);
    }

    category.name = name ? name.trim() : category.name;
    category.description = description ? description.trim() : category.description;
    category.isActive = isActive !== undefined ? isActive : category.isActive;

    await category.save();

    return successResponse(res, "Category updated successfully.", category);
  } catch (err) {
    next(err);
  }
};

// ✅ Soft delete category (Admin only)
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || category.isDeleted) {
      return errorResponse(res, "Category not found.", 404);
    }

    category.isDeleted = true;
    await category.save();

    return successResponse(res, "Category deleted successfully.", null);
  } catch (err) {
    next(err);
  }
};



// import Category from "../../models/category.model.js";
// import { errorResponse, successResponse } from "../../utils/responseHandler.js";
// // import { successResponse, errorResponse } from "../utils/responseHandler.js";

// // Create category (Admin only)
// export const createCategory = async (req, res, next) => {
//   try {
//     const { name, description } = req.body;
//  if (!name) {
//       return errorResponse(res, "category name required.", 400);
//     }

//     const existing = await Category.findOne({ name });
//     if (existing) {
//       return errorResponse(res, "Category already exists", 400);
//     }

//     const category = await Category.create({ name, description });
//     return successResponse(res, "Category created successfully", category, 201);
//   } catch (err) {
//     next(err);
//   }
// };

// // Get all categories (public)
// export const getCategories = async (req, res, next) => {
//   try {
//     const categories = await Category.find({ isDeleted: false }).sort({ createdAt: -1 });
//     return successResponse(res, "Categories fetched successfully", categories);
//   } catch (err) {
//     next(err);
//   }
// };

// // Get single category by slug (public)
// export const getCategoryBySlug = async (req, res, next) => {
//   try {
//     const category = await Category.findOne({ slug: req.params.slug, isDeleted: false });
//     if (!category) return errorResponse(res, "Category not found", 404);

//     return successResponse(res, "Category fetched successfully", category);
//   } catch (err) {
//     next(err);
//   }
// };

// // Update category (Admin only)
// export const updateCategory = async (req, res, next) => {
//   try {
//     const { name, description, isActive } = req.body;

//     const category = await Category.findById(req.params.id);
//     if (!category || category.isDeleted) {
//       return errorResponse(res, "Category not found", 404);
//     }

//     category.name = name || category.name;
//     category.description = description || category.description;
//     category.isActive = isActive !== undefined ? isActive : category.isActive;
//     await category.save();

//     return successResponse(res, "Category updated successfully", category);
//   } catch (err) {
//     next(err);
//   }
// };

// // Soft delete category (Admin only)
// export const deleteCategory = async (req, res, next) => {
//   try {
//     const category = await Category.findById(req.params.id);
//     if (!category || category.isDeleted) {
//       return errorResponse(res, "Category not found", 404);
//     }

//     category.isDeleted = true;
//     await category.save();

//     return successResponse(res, "Category deleted successfully", null);
//   } catch (err) {
//     next(err);
//   }
// };
