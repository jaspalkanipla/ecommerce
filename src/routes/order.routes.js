import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createOrder, getMyOrders, getOrderById } from "../controllers/order/order.controller.js";
// import { createOrder } from "../controllers/order/order.controller.js";
// import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ✅ Checkout → Create Order
router.post("/checkout", protect, createOrder);
// ✅ User Orders
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

export default router;
