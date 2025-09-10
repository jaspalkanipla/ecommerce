import mongoose from "mongoose";
import slugify from "slugify";

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true }, // auto generate
  description: { type: String },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category", 
    required: true 
  }, // parent category ka reference
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

// Slug generate before save
subcategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.models.Subcategory || mongoose.model("Subcategory", subcategorySchema);
