import express from "express";
import { sendEmailWithImage, sendTestEmail } from "../controllers/emailController.js";

const router = express.Router();

router.get("/send", sendTestEmail);
router.get("/sendWithLogo", sendEmailWithImage);

export default router;
