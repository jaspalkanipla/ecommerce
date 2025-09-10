import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        slug: { type: String, unique: true }, // auto generate from name
        description: { type: String },
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 }, // kitna quantity available h
        brand: { type: String },
        images: [{ type: String }], // multiple images ka array (S3 ya Cloudinary ka URL rakhoge future me)
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        subcategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subcategory",
            required: false, // optional — product directly category me bhi ho sakta h
        },

        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// slug auto-generate
productSchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);
