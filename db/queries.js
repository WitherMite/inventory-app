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
