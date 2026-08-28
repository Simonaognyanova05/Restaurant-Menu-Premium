const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'EUR', uppercase: true, trim: true, minlength: 3, maxlength: 3 },
    imageUrl: { type: String, trim: true },
    allergens: [{ type: String, trim: true }],
    dietaryTags: [{ type: String, trim: true }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    sortOrder: { type: Number, default: 0, min: 0 },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

dishSchema.index({ category: 1, sortOrder: 1 });
dishSchema.index({ isAvailable: 1, isFeatured: 1 });

module.exports = mongoose.model('Dish', dishSchema);
