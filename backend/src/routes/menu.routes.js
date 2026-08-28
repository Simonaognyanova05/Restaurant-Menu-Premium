const router = require('express').Router();
const { requireAdmin } = require('../middlewares/auth.middleware');
const menuController = require('../controllers/menu.controller');

router.get('/', menuController.getMenu);
router.post('/categories', requireAdmin, menuController.createCategory);
router.patch('/categories/:id', requireAdmin, menuController.updateCategory);
router.delete('/categories/:id', requireAdmin, menuController.deleteCategory);
router.post('/dishes', requireAdmin, menuController.createDish);
router.patch('/dishes/:id', requireAdmin, menuController.updateDish);
router.delete('/dishes/:id', requireAdmin, menuController.deleteDish);

module.exports = router;
