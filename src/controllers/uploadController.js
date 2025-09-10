import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

import s3 from "../config/s3.js";


const uploadFile = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        return res.status(200).json({
            message: "File uploaded successfully",
            fileUrl: req.file.location, // multer-s3 deta hai
            mimeType: req.file.mimetype,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "File upload failed" });
    }
};

export { uploadFile };

// multiple files upload
const uploadFiles = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // multer-s3 automatically gives `file.location`
    const fileUrls = req.files.map(file => file.location);

    return res.status(200).json({
      message: "Files uploaded successfully",
      files: fileUrls,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Multiple file upload failed" });
  }
};

export { uploadFiles };



const deleteFile = async (req, res) => {
    try {
        const { key } = req.body; // key: "uploads/12345-profile.png"

        if (!key) {
            return res.status(400).json({ message: "File key is required" });
        }

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        };

        await s3.send(new DeleteObjectCommand(params));

        return res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "File deletion failed", error });
    }
};

export { deleteFile };

const deleteMultipleFiles = async (req, res) => {
  try {
    const { keys } = req.body; // array of keys

    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return res.status(400).json({ message: "File keys array is required" });
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Delete: {
        Objects: keys.map(key => ({ Key: key })),
      },
    };

    await s3.send(new DeleteObjectsCommand(params));

    return res.status(200).json({ message: "Files deleted successfully" });
  } catch (error) {
    console.error("Delete multiple error:", error);
    res.status(500).json({ message: "Files deletion failed", error });
  }
};

export { deleteMultipleFiles };


const listAllFiles = async (req, res) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
    };

    const data = await s3.send(new ListObjectsV2Command(params));

    // Objects array → each object has Key, Size, LastModified, etc.
    const files = (data.Contents || []).map(obj => ({
      key: obj.Key,
      size: obj.Size,
      lastModified: obj.LastModified,
    }));

    return res.status(200).json({
      message: "Files retrieved successfully",
      files,
    });
  } catch (error) {
    console.error("List error:", error);
    res.status(500).json({ message: "Failed to list files", error });
  }
};

export { listAllFiles };







// import dotenv from "dotenv";
// dotenv.config();
// const PORT = process.env.PORT

// export const singleUpload = (req, res) => {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });
//     res.json({
//         message: "File uploaded successfully",
//         file: req.file,
//         url: `http://localhost:${PORT}/uploads/${req.file.filename}`,
//     });
// };

// export const multipleUpload = (req, res) => {
//     if (!req.files || req.files.length === 0)
//         return res.status(400).json({ message: "No files uploaded" });

//     const files = req.files.map(f => ({
//         filename: f.filename,
//         url: `http://localhost:${PORT}/uploads/${f.filename}`
//     }));

//     res.json({ message: "Files uploaded successfully", files });
// };
