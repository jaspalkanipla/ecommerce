import express from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
    deleteUser,
    createAdmin,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
    changePassword,
} from "../controllers/user/user.controller.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Public routes
router.post("/register", registerUser);   // Normal user register
router.post("/login", loginUser);         // User login
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
// forgot + reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// change password (protected)
router.post("/change-password", protect, changePassword);

// ✅ Protected routes (any logged-in user)
router.get("/profile", protect, getUserProfile);

// ✅ Admin-only routes
router.delete("/:id", protect, authorizeRoles("admin", "superadmin"), deleteUser);

// ✅ Superadmin-only route (to create admin/superadmin)
router.post(
    "/create-admin",
    protect,
    authorizeRoles("superadmin"),
    createAdmin
);

export default router;


// import express from "express";
// import { registerUser, loginUser, getUserProfile, deleteUser, createAdmin } from "../controllers/user.controller.js";
// import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// // Public routes
// router.post("/register", registerUser);
// router.post("/login", loginUser);

// // Logged-in user
// router.get("/profile", protect, getUserProfile);

// // Soft delete (sirf admin ya superadmin allowed)
// router.delete("/:id", protect, authorizeRoles("admin", "superadmin"), deleteUser);

// router.post(
//   "/create-admin",
//   protect,
//   authorizeRoles("superadmin"),
//   createAdmin
// );
// export default router;

