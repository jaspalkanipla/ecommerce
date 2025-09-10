import mongoose from "mongoose";

// Order Item Schema
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  name: String, // snapshot of product name
  price: Number, // snapshot of price
  quantity: { type: Number, required: true }
});

// Shipping Address (snapshot from User.addresses)
const shippingAddressSchema = new mongoose.Schema({
  label: String,
  name: String,
  phone: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  postalCode: String,
  country: String
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema, // snapshot
    paymentMethod: {
      type: String,
      enum: ["COD", "Card", "UPI"],
      default: "COD"
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
