import express from "express";
// import { addAddress, updateAddress, deleteAddress, getAddresses } from "../controllers/user/address/address.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import { addAddress, deleteAddress, getAddresses, updateAddress } from "../controllers/user/address/address.controller.js";

const router = express.Router();

router.post("/", protect, addAddress);
router.get("/", protect, getAddresses);
router.put("/:addressId", protect, updateAddress);
router.delete("/:addressId", protect, deleteAddress);

export default router;
