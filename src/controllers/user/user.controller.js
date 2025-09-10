// import User from "../../models/user.model.js";
// import bcrypt from "bcryptjs";
// import generateToken from "../../utils/generateToken.js";
// import { successResponse, errorResponse } from "../../utils/responseHandler.js";

// // Register new user (only normal users)
// export const registerUser = async (req, res, next) => {
//   try {
//     const { name, email, password, phone } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return errorResponse(res, "User already exists", 400);
//     }
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);


//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       phone,
//       role: "user" // 🔒 force user role (admin/superadmin not allowed here)
//     });

//     return successResponse(
//       res,
//       "User registered successfully",
//       {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         token: generateToken(user)
//       },
//       201
//     );
//   } catch (err) {
//     next(err);
//   }
// };
import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";
import { sendEmail } from "../../utils/email.js";
import generateToken from './../../utils/generateToken.js';

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    let user = await User.findOne({ email });

    if (user && user.isEmailVerified) {
      // User exists and already verified
      return errorResponse(res, "User already exists with this email", 400);
    }

    if (user && !user.isEmailVerified) {
      // User exists but not verified → regenerate token
      const verifyToken = crypto.randomBytes(32).toString("hex");
      user.emailVerifyToken = verifyToken;
      user.emailVerifyExpire = Date.now() + 1000 * 60 * 60; // 1h
      await user.save();

      const verifyUrl = `${process.env.BACKEND_URL}/api/users/verify-email/${verifyToken}`;
      await sendEmail({
        to: email,
        subject: "Verify your email",
        html: `<p>Hello ${user.name},</p>
               <p>Please verify your email by clicking the link below:</p>
               <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>`
      });

      return successResponse(res, "Verification email re-sent. Please check your inbox.", null, 200);
    }

    // ✅ New User Create
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "user",
      isEmailVerified: false
    });

    // Generate token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.emailVerifyToken = verifyToken;
    user.emailVerifyExpire = Date.now() + 1000 * 60 * 60; // 1h
    await user.save();

    const verifyUrl = `${process.env.BACKEND_URL}/api/users/verify-email/${verifyToken}`;
    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `<p>Hello ${name},</p>
             <p>Please verify your email by clicking the link below:</p>
             <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>`
    });

    return successResponse(res, "Registration successful. Please verify your email.", null, 201);
  } catch (err) {
    next(err);
  }
};


export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerifyToken: token,
      emailVerifyExpire: { $gt: Date.now() }
    });

    if (!user) {
      return errorResponse(res, "Invalid or expired token", 400);
    }

    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpire = undefined;
    await user.save();

    // Send confirmation email with credentials
    await sendEmail({
      to: user.email,
      subject: "Account Verified Successfully",
      html: `<p>Dear ${user.name},</p>
             <p>Your account has been created successfully.</p>
             <p><b>Email:</b> ${user.email}</p>
             <p>You can now login using your credentials.</p>`
    });

    return successResponse(res, "Email verified successfully. You can now login.", null, 200);
  } catch (err) {
    next(err);
  }
};


export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Industry me yaha usually generic response dete hain for security
      return successResponse(res, "If the account exists, verification email has been sent.", null, 200);
    }

    if (user.isEmailVerified) {
      return errorResponse(res, "Email already verified, please login.", 400);
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.emailVerifyToken = verifyToken;
    user.emailVerifyExpire = Date.now() + 1000 * 60 * 60;
    await user.save();

    const verifyUrl = `${process.env.BACKEND_URL}/api/users/verify-email/${verifyToken}`;
    await sendEmail({
      to: user.email,
      subject: "Resend Email Verification",
      html: `<p>Hello ${user.name},</p>
  <p>Please verify your email by clicking the link below:</p>
  <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>`
    });

    return successResponse(res, "Verification email sent again. Please check your inbox.", null, 200);
  } catch (err) {
    next(err);
  }
};


export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      // generic message for security
      return successResponse(res, "If account exists, password reset link has been sent.");
    }

    // generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 1000 * 60 * 15; // 15 minutes
    await user.save();

    const resetUrl = `${process.env.BACKEND_URL}/api/users/reset-password/${resetToken}`;

    // send email
    const info = await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Hello ${user.name},</p>
             <p>You requested to reset your password. Click the link below:</p>
             <a href="${resetUrl}" target="_blank">${resetUrl}</a>
             <p>If you didn’t request this, ignore this email.</p>`
    });
    console.log("info: of forgot email mail", info);

    return successResponse(res, "Password reset email sent. Please check your inbox.");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Reset Password
 * @route POST /api/users/reset-password/:token
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
      isDeleted: false,
    });

    if (!user) {
      return errorResponse(res, "Invalid or expired token", 400);
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Password Reset Successful",
      html: `<p>Hello ${user.name},</p>
             <p>Your password has been reset successfully.</p>`
    });

    return successResponse(res, "Password has been reset successfully.");
  } catch (err) {
    next(err);
  }
};


/**
 * @desc Change Password (logged-in user)
 * @route POST /api/users/change-password
 * @access Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword) {
      return errorResponse(res, "old password required.", 400);
    }

    if (!newPassword) {
      return errorResponse(res, "old password required.", 400);
    }
    const user = await User.findById(req.user.id); // req.user.id JWT se aata hai (authMiddleware)

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return errorResponse(res, "Old password is incorrect", 400);
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return successResponse(res, "Password changed successfully.");
  } catch (err) {
    next(err);
  }
};


// // Login user

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
     if (!email) {
      return errorResponse(res, "email is required.", 400);
    }

    if (!password) {
      return errorResponse(res, "password is required.", 400);
    }

    const user = await User.findOne({ email, isDeleted: false });
    if (!user) return errorResponse(res, "Invalid email or password", 401);

    if (!user.isEmailVerified) {
      return errorResponse(res, "Please verify your email before login.", 400);
    }

    if (!user.isActive) {
      return errorResponse(res, "Account is inactive, contact support.", 403);
    }

    if (user.isDeleted) {
      return errorResponse(res, "User not found.", 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorResponse(res, "Invalid email or password", 401);

    return successResponse(res, "Login successful", {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (err) {
    next(err);
  }
};

// export const loginUser = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email, isDeleted: false });
//     if (!user) return errorResponse(res, "Invalid email or password", 401);
//     // if (!user.isEmailVerified) {
//     //   return res.status(400).json({ success: false, message: "Please verify your email before login." });
//     // }
//     // if (!user.isActive) {
//     //   return res.status(403).json({ success: false, message: "Account is inactive, contact support." });
//     // }
//     if (user.isDeleted) {
//       return res.status(404).json({ success: false, message: "User not found." });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return errorResponse(res, "Invalid email or password", 401);

//     return successResponse(res, "Login successful", {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token: generateToken(user)
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// Get logged-in user's profile
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user || user.isDeleted) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, "Profile fetched successfully", user);
  } catch (err) {
    next(err);
  }
};

// Soft delete user
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!user) return errorResponse(res, "User not found", 404);

    return successResponse(res, "User soft-deleted successfully", user);
  } catch (err) {
    next(err);
  }
};


// Create admin (only superadmin can do this)
export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!["admin", "superadmin"].includes(role)) {
      return errorResponse(res, "Invalid role for this route", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, "User already exists", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role
    });

    return successResponse(
      res,
      `${role} created successfully`,
      { id: user._id, name: user.name, email: user.email, role: user.role },
      201
    );
  } catch (err) {
    next(err);
  }
};
