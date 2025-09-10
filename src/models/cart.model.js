import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true // हर user का एक active cart
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// ✅ Calculate total before saving
cartSchema.pre("save", async function (next) {
  if (!this.isModified("items")) return next();

  // Product prices fetch करके total निकाले
  const Product = mongoose.model("Product");
  let total = 0;
  for (const item of this.items) {
    const product = await Product.findById(item.product);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  this.totalPrice = total;
  next();
});

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
