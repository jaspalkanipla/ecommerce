import express from "express";
import { generateInvoicePDF, generateSamplePDF } from "../controllers/pdfController.js";

const router = express.Router();

router.get("/sample", generateSamplePDF);
router.get("/invoice", generateInvoicePDF);

export default router;
