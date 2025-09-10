import Product from "../../models/product.model.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

// ✅ Create Product
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, brand, category, subcategory } = req.body;

    // Basic validation
    if (!name || !price || !category) {
      return errorResponse(res, "Name, Price, and Category are required", 400);
    }

    // Already exist check
    const existing = await Product.findOne({ name });
    if (existing) {
      return errorResponse(res, "Product already exists", 400);
    }

    // Images (multerS3 se URLs aa jayengi)
    const imageUrls = req.files ? req.files.map((file) => file.location) : [];

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      brand,
      category,
      subcategory,
      images: imageUrls,
    });

    return successResponse(res, "Product created successfully", product, 201);
  } catch (err) {
    next(err);
  }
};

// ✅ Get all Products
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isDeleted: false })
      .populate("category")
      .populate("subcategory")
      .sort({ createdAt: -1 });

    return successResponse(res, "Products fetched successfully", products);
  } catch (err) {
    next(err);
  }
};

// ✅ Get single Product by slug
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isDeleted: false })
      .populate("category")
      .populate("subcategory");

    if (!product) return errorResponse(res, "Product not found", 404);

    return successResponse(res, "Product fetched successfully", product);
  } catch (err) {
    next(err);
  }
};

// ✅ Update Product
export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, brand, category, subcategory, isActive } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product || product.isDeleted) {
      return errorResponse(res, "Product not found", 404);
    }

    // Fields update
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock !== undefined ? stock : product.stock;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.subcategory = subcategory || product.subcategory;
    product.isActive = isActive !== undefined ? isActive : product.isActive;

    // New images (agar update ke time upload kare)
    if (req.files && req.files.length > 0) {
      product.images.push(...req.files.map((file) => file.location));
    }

    await product.save();

    return successResponse(res, "Product updated successfully", product);
  } catch (err) {
    next(err);
  }
};

// ✅ Soft Delete Product
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.isDeleted) {
      return errorResponse(res, "Product not found", 404);
    }

    product.isDeleted = true;
    await product.save();

    return successResponse(res, "Product deleted successfully", null);
  } catch (err) {
    next(err);
  }
};
