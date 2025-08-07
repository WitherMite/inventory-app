const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();

router.get("/", controller.renderIndex);
router.get("/category", controller.renderCategory);
router.get("/item", controller.renderItem);

module.exports = router;
