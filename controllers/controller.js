const readDB = require("../db/read-queries");
const writeDB = require("../db/write-queries");
const validators = require("./validators");
const { validationResult } = require("express-validator");

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

exports.renderItemCategoryForm = async (req, res) => {
  const parent = {
    id: req.query.parentId,
    type: req.query.parentType,
  };
  const optionsType = req.query.optionsType;
  const list = [];

  switch (optionsType) {
    case "items":
      const itemList = await readDB.getItemsNotInCategory(parent.id);
      list.push(...itemList);
      break;
    case "categories":
      const categoryList = await readDB.getCategoriesNotInItem(parent.id);
      list.push(...categoryList);
      break;
    default:
      throw new Error(`no valid list of options for "${optionsType}"`);
  }

  res.render("item-category-form", {
    parent,
    options: { type: optionsType, list },
  });
};

exports.editItem = [
  // validators.item,
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).render("index", {
    //     errors: errors.array(),
    //   });
    // }
    const { id, name, description, price, inventory, password } = req.body;
    await writeDB.updateItem({
      id,
      name,
      description,
      price,
      inventory,
      password,
    });
    res.redirect("/item?q=" + id);
  },
];

exports.editCategory = [
  // validators.category,
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).render("index", {
    //     errors: errors.array(),
    //   });
    // }
    const { id, name, description, password } = req.body;
    await writeDB.updateCategory({
      id,
      name,
      description,
      password,
    });
    res.redirect("/category?q=" + id);
  },
];

exports.addItem = [
  // validators.item,
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).render("index", {
    //     errors: errors.array(),
    //   });
    // }
    const { name, description, price, inventory, password } = req.body;
    const id = await writeDB.newItem({
      name,
      description,
      price,
      inventory,
      password,
    });
    res.redirect("/item?q=" + id);
  },
];

exports.addCategory = [
  // validators.category,
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).render("index", {
    //     errors: errors.array(),
    //   });
    // }
    const { name, description, password } = req.body;
    const id = await writeDB.newCategory({
      name,
      description,
      password,
    });
    res.redirect("/category?q=" + id);
  },
];

exports.addItemCategories = [
  // validators.category,
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).render("index", {
    //     errors: errors.array(),
    //   });
    // }
    const { parentId, parentType, selectedIds, password } = req.body;
    const entries = [];
    switch (parentType) {
      case "item":
        [...selectedIds].forEach((id) => {
          entries.push([parentId, id]);
        });
        break;
      case "category":
        [...selectedIds].forEach((id) => {
          entries.push([id, parentId]);
        });
        break;
      default:
        throw new Error(
          `"${parentType}" is not a valid target (item/category)`
        );
    }
    await writeDB.addItemsToCategories(entries, password);
    res.redirect(`/${parentType}?q=${parentId}`);
  },
];

exports.deleteItem = [
  // validators.category,
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).render("index", {
    //     errors: errors.array(),
    //   });
    // }
    const { id, password } = req.body;
    await writeDB.deleteItemById(id, password);
    res.redirect("/");
  },
];

exports.deleteCategory = [
  // validators.category,
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).render("index", {
    //     errors: errors.array(),
    //   });
    // }
    const { id, password } = req.body;
    await writeDB.deleteCategoryById(id, password);
    res.redirect("/");
  },
];
