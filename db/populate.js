#! /usr/bin/env node
const { Client } = require("pg");
const fs = require("fs");
const connectionURI = process.argv[2];
const caPath = process.argv[3];
const certificate = caPath ? fs.readFileSync(caPath).toString() : false;

// change to run any db setup queries needed
const SQL = `
  -- Set up tables
  DROP TABLE items;
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT UNIQUE,
    description TEXT,
    price MONEY,
    inventory INTEGER
  );
  DROP TABLE categories;
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT UNIQUE,
    description TEXT
  );
  DROP TABLE item_category;
  CREATE TABLE IF NOT EXISTS item_category (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    item_id INTEGER,
    category_id INTEGER
  );

  -- add categories
  INSERT INTO categories (name, description)
  VALUES ('Produce', 'Fresh fruit and vegetables.')
  ON CONFLICT (name) DO NOTHING;

  INSERT INTO categories (name, description)
  VALUES ('Meats', 'Quality meats at affordable prices.')
  ON CONFLICT (name) DO NOTHING;
  
  INSERT INTO categories (name, description)
  VALUES ('Kitchenware', 'Everyday cooking essentials.')
  ON CONFLICT (name) DO NOTHING;

  -- add items

  INSERT INTO items (name, description, price, inventory)
  VALUES ('Placeholder Farms Whole Carrots', '1lb bag of crisp orange carrots.', 1.37 , 123)
  ON CONFLICT (name) DO NOTHING;

  INSERT INTO items (name, description, price, inventory)
  VALUES ('Placeholder Farms Banana Bunch', 'Bunch of organic bananas.', 2.49 , 301)
  ON CONFLICT (name) DO NOTHING;

  INSERT INTO items (name, description, price, inventory)
  VALUES ('Placeholder Farms Sirloin Steak', '1lb Tray of 4 fresh sirloin steaks.', 16.43 , 32)
  ON CONFLICT (name) DO NOTHING;

  INSERT INTO items (name, description, price, inventory)
  VALUES ('Placeholder Farms Whole Chicken', 'Free range whole chicken.', 9.89 , 65)
  ON CONFLICT (name) DO NOTHING;

  INSERT INTO items (name, description, price, inventory)
  VALUES ('Steel 8" Chef Knife', 'A kitchen essential, versatile and sharp.', 51.48 , 6)
  ON CONFLICT (name) DO NOTHING;

  INSERT INTO items (name, description, price, inventory)
  VALUES ('12" Cast Iron Skillet', 'A favorite of many cooks, and compatible with induction, ceramic, electric, and gas cooktops.', 15.29 , 24)
  ON CONFLICT (name) DO NOTHING;
  
  -- add items to categories
  
  INSERT INTO item_category (item_id, category_id)
  VALUES (1, 1);

  INSERT INTO item_category (item_id, category_id)
  VALUES (2, 1);

  INSERT INTO item_category (item_id, category_id)
  VALUES (3, 2);

  INSERT INTO item_category (item_id, category_id)
  VALUES (4, 2);

  INSERT INTO item_category (item_id, category_id)
  VALUES (5, 3);

  INSERT INTO item_category (item_id, category_id)
  VALUES (6, 3);
`;

async function main() {
  console.log("seeding...");
  const config = certificate
    ? {
        connectionString: connectionURI,
        ssl: {
          rejectUnauthorized: true,
          ca: certificate,
        },
      }
    : { connectionString: connectionURI };
  const client = new Client(config);
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
