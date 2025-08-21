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

exports.newItem = async (fields) => {
  const { rows } = await sendQuery(
    `
      INSERT INTO items (name, description, price, inventory)
      VALUES ($1, $2, $3 , $4)
      ON CONFLICT (name) DO NOTHING
      RETURNING id;
    `,
    [fields.name, fields.description, fields.price, fields.inventory],
    fields.password
  );
  return rows[0].id;
};

exports.newCategory = async (fields) => {
  const { rows } = await sendQuery(
    `
    INSERT INTO categories (name, description)
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
    RETURNING id;
  `,
    [fields.name, fields.description],
    fields.password
  );
  return rows[0].id;
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

exports.deleteItemById = async (id, password) => {
  await sendQuery("DELETE FROM items WHERE id = $1;", [id], password);
  await sendQuery(
    "DELETE FROM item_category WHERE item_id = $1;",
    [id],
    password
  );
};

exports.deleteCategoryById = async (id, password) => {
  await sendQuery("DELETE FROM categories WHERE id = $1;", [id], password);
  await sendQuery(
    "DELETE FROM item_category WHERE category_id = $1;",
    [id],
    password
  );
};

exports.removeItemFromCategory = async (itemId, categoryId, password) => {
  await sendQuery(
    "DELETE FROM item_category WHERE item_id = $1 AND category_id = $2;",
    [itemId, categoryId],
    password
  );
};
