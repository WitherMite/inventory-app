const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();

router.get("/", controller.renderIndex);
router.get("/category", controller.renderCategory);
router.get("/item", controller.renderItem);
router.get(["/category/edit", "/category/new"], controller.renderCategoryForm);
router.get(["/item/edit", "/item/new"], controller.renderItemForm);
router.get("/item-category/new", controller.renderItemCategoryForm);

router.post("/category/edit", controller.editCategory);
router.post("/item/edit", controller.editItem);
router.post("/category/new", controller.addCategory);
router.post("/item/new", controller.addItem);
router.post("/item-category/new", controller.addItemCategories);

router.post("/category/delete", controller.deleteCategory);
router.post("/item/delete", controller.deleteItem);
// router.post("/item-category/delete", controller.removeItemCategories);

module.exports = router;
