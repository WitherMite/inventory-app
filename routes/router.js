const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();

router.get("/", controller.renderIndex);
router.get("/category", controller.renderCategory);
router.get("/item", controller.renderItem);
router.get(["/category/edit", "/category/new"], controller.renderCategoryForm);
router.get(["/item/edit", "/item/new"], controller.renderItemForm);

module.exports = router;
