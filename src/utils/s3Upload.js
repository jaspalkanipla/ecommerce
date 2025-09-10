import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";
import { v4 as uuidv4 } from "uuid";

export const uploadToS3 = async (buffer, folder = "pdfs", fileName) => {
  try {
    // const key = `${folder}/${fileName || uuidv4()}.pdf`;
    // const key = `${folder}/${fileName || uuidv4()}`;

        // ensure .pdf extension once only
    let finalName = fileName || uuidv4();
    if (!finalName.toLowerCase().endsWith(".pdf")) {
      finalName += ".pdf";
    }

    const key = `${folder}/${finalName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: "application/pdf",
    //   ACL: "public-read", // agar public URL chahiye
    });

    await s3.send(command);

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error("Failed to upload file to S3");
  }
};
