const readDB = require("../db/read-queries");

exports.renderIndex = async (req, res) => {
  const categories = await readDB.getCategories();
  const items = await readDB.getItems();
  res.render("index", { categories, items });
};

exports.renderCategory = async (req, res) => {
  const category = (await readDB.getCategoryById(req.query.q))[0];
  const items = await readDB.getItemsByCategory(category.id);
  res.render("view-category", { category, items });
};

exports.renderItem = async (req, res) => {
  const item = (await readDB.getItemById(req.query.q))[0];
  const categories = await readDB.getCategoriesByItem(item.id);
  res.render("view-item", { item, categories });
};

exports.renderCategoryForm = async (req, res) => {
  if (!req.query.n) return res.render("category-form");
  const category = (await readDB.getCategoryById(req.query.n))[0];
  res.render("category-form", { category });
};

exports.renderItemForm = async (req, res) => {
  if (!req.query.n) return res.render("item-form");
  const item = (await readDB.getItemById(req.query.n))[0];
  res.render("item-form", { item });
};
