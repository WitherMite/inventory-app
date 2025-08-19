const pool = require("./pool");

exports.getCategories = async () => {
  const { rows } = await pool.query("SELECT * FROM categories;");
  return rows;
};

exports.getItems = async () => {
  const { rows } = await pool.query("SELECT * FROM items;");
  return rows;
};

exports.getCategoryById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1;", [
    id,
  ]);
  return rows;
};

exports.getItemById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM items WHERE id = $1;", [id]);
  return rows;
};

exports.getItemsByCategory = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM item_category JOIN items ON items.id = item_id WHERE category_id = $1;",
    [id]
  );
  return rows;
};

exports.getCategoriesByItem = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM item_category JOIN categories ON categories.id = category_id WHERE item_id = $1;",
    [id]
  );
  return rows;
};

exports.getItemsNotInCategory = async (id) => {
  const { rows } = await pool.query(
    `
      SELECT * FROM items WHERE items.id NOT IN (
        SELECT DISTINCT item_id FROM item_category JOIN items ON items.id = item_id WHERE category_id = $1
      ) ORDER BY id;
    `,
    [id]
  );
  return rows;
};

exports.getCategoriesNotInItem = async (id) => {
  const { rows } = await pool.query(
    `
      SELECT * FROM categories WHERE categories.id NOT IN (
        SELECT DISTINCT category_id FROM item_category JOIN categories ON categories.id = category_id WHERE item_id = $1
      ) ORDER BY id;
    `,
    [id]
  );
  return rows;
};
