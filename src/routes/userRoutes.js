import express from "express";
import { registerUser, loginUser, getProfile, allUsers, allUsersPDF } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
// router.get("/all", protect, allUsers);
router.get("/all",  allUsers);
router.get("/allUsersPDF",  allUsersPDF);

export default router;
