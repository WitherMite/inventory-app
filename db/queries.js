const pool = require("./pool");

exports.getCategories = async () => {
  const { rows } = await pool.query("SELECT * FROM categories;");
  return rows;
};

exports.getItems = async () => {
  const { rows } = await pool.query("SELECT * FROM items;");
  return rows;
};
