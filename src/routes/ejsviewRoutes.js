
import express from "express";
import { ejsviewController, renderInvoice } from "../controllers/ejsviewController.js";

const router = express.Router();

router.get("/ejs-test", ejsviewController);

router.get("/invoice", renderInvoice);
export default router;
