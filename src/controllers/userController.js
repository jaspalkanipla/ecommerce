import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import path from 'path';
import ejs from 'ejs';
import { generatePDF } from "../utils/generatePDF.js";
import { uploadToS3 } from "../utils/s3Upload.js";
import { sendEmail } from "../utils/email.js";

// @desc Register new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) return res.status(200).json({ message: "name  is required" });
    if (!email) return res.status(200).json({ message: "email is required" });
    if (!password) return res.status(200).json({ message: "password is required" });
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(200).json({ message: "email is required" });
    if (!password) return res.status(200).json({ message: "password is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const allUsersPDF = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }

    // 1. Generate PDF buffer
    const { pdfBuffer, fileName } = await generatePDF(users, "users.ejs", {
      downloadName: "users.pdf",
    });

    // 2. Upload to S3
    const pdfUrl = await uploadToS3(pdfBuffer, "reports", fileName);

    // 3. DB me save karna (example only)
    // await Report.create({ type: "users", url: pdfUrl, createdBy: req.user.id });

    // 4. Send response
    res.status(200).json({ message: "PDF uploaded to S3", url: pdfUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const allUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }

    // Call generatePDF with options
    const { pdfBuffer, fileName } = await generatePDF(
      users,
      "users.ejs",
      {
        format: "A4",          // bigger size
        downloadName: "users.pdf", // custom name
        // landscape: true,           // horizontal layout
        // margin: { top: "20px", right: "15px", bottom: "20px", left: "15px" }
      }
    );

    const dispositionType = req.query.download === "true" ? "attachment" : "inline";

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `${dispositionType}; filename=${fileName}`,
    });

    await sendEmail({
      to: "yashpalkanipla13@gmail.com", // you can take from req.body.to
      subject: "All Users List 🚀",
      html: "<h1>Hello!</h1><p>This is Users list 🚀</p>",
      attachments: [
        {
          // filename: "abc.png",   // the name user will see
          // path: filePath,           // absolute path
          // filename: "users.pdf",   // the name user will see
          // path: "https://jaspal-s3-bucketfortesting.s3.ap-south-1.amazonaws.com/reports/users.pdf",          // absolute path
          filename: fileName,   // the name user will see
          content: pdfBuffer
        },
      ],
    });

    res.send(pdfBuffer);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getProfile = async (req, res) => {
  res.status(200).json(req.user);
};
