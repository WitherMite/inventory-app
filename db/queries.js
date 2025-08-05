const pool = require("./pool");

exports.getCategories = async () => {
  const { rows } = await pool.query("SELECT * FROM categories;");
  return rows;
};
