const db = require("../db/queries");

exports.renderIndex = async (req, res) => {
  const categories = await db.getCategories();
  res.render("index", { categories });
};

exports.renderCategory = async (req, res) => {
  // TODO: render a detailed view of category and the items it contains
  res.render("index");
};
