const menuService = require('../services/menu.service');

const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

const getMenu = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await menuService.listMenu() });
});

const createCategory = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await menuService.createCategory(req.body) });
});

const updateCategory = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await menuService.updateCategory(req.params.id, req.body) });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await menuService.deleteCategory(req.params.id);
  res.status(204).send();
});

const createDish = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await menuService.createDish(req.body) });
});

const updateDish = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await menuService.updateDish(req.params.id, req.body) });
});

const deleteDish = asyncHandler(async (req, res) => {
  await menuService.deleteDish(req.params.id);
  res.status(204).send();
});

module.exports = { getMenu, createCategory, updateCategory, deleteCategory, createDish, updateDish, deleteDish };
