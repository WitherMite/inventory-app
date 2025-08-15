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

module.exports = router;
