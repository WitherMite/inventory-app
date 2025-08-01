const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();

router.get("/", controller.renderIndex);

module.exports = router;
