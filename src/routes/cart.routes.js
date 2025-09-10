import express from "express";
// import authMiddleware from "../../middlewares/auth.js"; // user req.user में लाने के लिए
import { addToCart, getCart, removeFromCart, updateCartItem } from "../controllers/cart/cart.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.post("/remove", protect, removeFromCart);
router.get("/", protect, getCart);
router.put("/update", protect, updateCartItem);


export default router;
