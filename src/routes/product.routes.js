import express from "express";
// import upload from "../../middlewares/upload.js"; // tumhara multer-s3 middleware
import {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} from "../controllers/product/product.controller.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// Multer config: multiple images allowed
router.post("/", upload.array("images", 5), createProduct);
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.put("/:id", upload.array("images", 5), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
