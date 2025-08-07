const db = require("../db/queries");

exports.renderIndex = async (req, res) => {
  const categories = await db.getCategories();
  const items = await db.getItems();
  res.render("index", { categories, items });
};

exports.renderCategory = async (req, res) => {
  const category = (await db.getCategoryById(req.query.q))[0];
  res.render("view-category", { category });
};

exports.renderItem = async (req, res) => {
  const item = (await db.getItemById(req.query.q))[0];
  res.render("view-item", { item });
};
