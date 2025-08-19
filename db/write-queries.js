const format = require("pg-format");
const pool = require("./pool");

const sendQuery = async (sql, values, password) => {
  if (password !== process.env.PASSWORD) throw new Error("Invalid password");
  return await pool.query(sql, values);
};

exports.updateItem = async (fields) => {
  await sendQuery(
    "UPDATE items SET name = $1, description = $2, price = $3, inventory = $4 WHERE id = $5",
    [
      fields.name,
      fields.description,
      fields.price,
      fields.inventory,
      fields.id,
    ],
    fields.password
  );
};

exports.updateCategory = async (fields) => {
  await sendQuery(
    "UPDATE categories SET name = $1, description = $2 WHERE id = $3",
    [fields.name, fields.description, fields.id],
    fields.password
  );
};

// where entries is a 2d array of id pairs - (item_id, category_id)
exports.addItemsToCategories = async (entries, password) => {
  await sendQuery(
    format(
      "INSERT INTO item_category (item_id, category_id) VALUES %L;",
      entries
    ),
    [],
    password
  );
};
