#! /usr/bin/env node
const { Client } = require("pg");
const fs = require("fs");
const connectionURI = process.argv[2];
const caPath = process.argv[3];
const certificate = caPath ? fs.readFileSync(caPath).toString() : false;

// change to run any db setup queries needed
const SQL = `
  -- Set up tables
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT UNIQUE,
    description TEXT,
    price MONEY,
    inventory INTEGER
  );
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT UNIQUE,
    description TEXT
  );
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
  
  -- add items to categories
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
