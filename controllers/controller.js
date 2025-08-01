const db = require("../db/queries");

exports.renderIndex = async (req, res) => {
  res.render("index");
};
