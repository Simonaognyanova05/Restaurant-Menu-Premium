const Category = require('../models/category.model');
const Dish = require('../models/dish.model');
const ApiError = require('../utils/api-error');

const listMenu = async () => {
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean();
  const dishes = await Dish.find({ isAvailable: true })
    .sort({ sortOrder: 1, name: 1 })
    .lean();

  return categories.map((category) => ({
    ...category,
    dishes: dishes.filter((dish) => String(dish.category) === String(category._id)),
  }));
};

const listAdminMenu = async () => {
  const categories = await Category.find().sort({ sortOrder: 1, name: 1 }).lean();
  const dishes = await Dish.find().sort({ sortOrder: 1, name: 1 }).lean();
  return categories.map((category) => ({
    ...category,
    dishes: dishes.filter((dish) => String(dish.category) === String(category._id)),
  }));
};

const createCategory = (payload) => Category.create(payload);
const updateCategory = async (id, payload) => {
  const category = await Category.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!category) throw new ApiError(404, 'Category not found');
  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new ApiError(404, 'Category not found');
  await Dish.deleteMany({ category: id });
};

const createDish = async (payload) => {
  const category = await Category.exists({ _id: payload.category });
  if (!category) throw new ApiError(400, 'Category not found');
  return Dish.create(payload);
};

const updateDish = async (id, payload) => {
  if (payload.category && !(await Category.exists({ _id: payload.category }))) {
    throw new ApiError(400, 'Category not found');
  }
  const dish = await Dish.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!dish) throw new ApiError(404, 'Dish not found');
  return dish;
};

const deleteDish = async (id) => {
  const dish = await Dish.findByIdAndDelete(id);
  if (!dish) throw new ApiError(404, 'Dish not found');
};

module.exports = { listMenu, listAdminMenu, createCategory, updateCategory, deleteCategory, createDish, updateDish, deleteDish };
