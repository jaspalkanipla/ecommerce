
import express from "express";
import upload from "../middlewares/upload.js";
import { deleteFile, deleteMultipleFiles, listAllFiles, uploadFile, uploadFiles } from "../controllers/uploadController.js";

const router = express.Router();

router.get("/list", listAllFiles);
router.post("/upload/single", upload.single("file"), uploadFile);
router.post("/upload/multiple", upload.array("files",5), uploadFiles);
router.delete("/delete//single", deleteFile);
router.delete("/delete/multiple", deleteMultipleFiles);
export default router;
