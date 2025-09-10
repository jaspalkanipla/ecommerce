import mongoose from "mongoose";

// Address schema (subdocument for multiple addresses)
const addressSchema = new mongoose.Schema({
  label: { type: String }, // "Home", "Office"
  name: { type: String },
  phone: { type: String },
  line1: { type: String },
  line2: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String, default: "India" },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, unique: true, sparse: true }, // unique phone (optional)
  role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
  addresses: [addressSchema],
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },   // user active/inactive
  isDeleted: { type: Boolean, default: false },  // soft delete
  emailVerifyToken: { type: String },
  emailVerifyExpire: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },

}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);




// import mongoose from "mongoose";

// // Address schema (subdocument for multiple addresses)
// const addressSchema = new mongoose.Schema({
//   label: { type: String }, // "Home", "Office"
//   name: { type: String },
//   phone: { type: String },
//   line1: { type: String },
//   line2: { type: String },
//   city: { type: String },
//   state: { type: String },
//   postalCode: { type: String },
//   country: { type: String, default: "India" },
//   isDefault: { type: Boolean, default: false }
// }, { _id: false });

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   phone: { type: String },
//   role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
//   addresses: [addressSchema],
//   isVerified: { type: Boolean, default: false },
//   isDeleted: { type: Boolean, default: false }
// }, { timestamps: true });

// export default mongoose.models.User || mongoose.model("User", userSchema);
