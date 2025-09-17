import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createRazorpayOrder, verifyPayment } from "../controllers/payment/payment.controller.js";

const router = express.Router();

// Create Razorpay order
// router.post("/razorpay/order", protect, createRazorpayOrder);
router.post("/razorpay/order",  createRazorpayOrder);

// Verify Razorpay payment
// router.post("/razorpay/verify", protect, verifyPayment);
router.post("/razorpay/verify",  verifyPayment);

export default router;
