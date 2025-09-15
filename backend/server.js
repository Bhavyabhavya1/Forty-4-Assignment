
import express from "express";
import path from "path";
import cors from "cors";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, process.env.DB_PATH || "database.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    // Create users table if it doesn't exist
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        username TEXT,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        website TEXT,
        street TEXT,
        suite TEXT,
        city TEXT,
        zipcode TEXT,
        geo_lat TEXT,
        geo_lng TEXT,
        company_name TEXT,
        company_catchPhrase TEXT,
        company_bs TEXT
      )
    `);

    app.get("/", (req, res) => {
      res.send("User Management API is running");
    })

    // GET /api/users - Get All Users
    app.get("/api/users", async (req, res) => {
      try {
        const rows = await db.all("SELECT * FROM users");
        // Assemble nested user objects
        const users = rows.map(row => ({
          id: row.id,
          name: row.name,
          username: row.username,
          email: row.email,
          phone: row.phone,
          website: row.website,
          address: {
            street: row.street,
            suite: row.suite,
            city: row.city,
            zipcode: row.zipcode,
            geo: {
              lat: row.geo_lat,
              lng: row.geo_lng
            }
          },
          company: {
            name: row.company_name,
            catchPhrase: row.company_catchPhrase,
            bs: row.company_bs
          }
        }));
        res.status(200).json({ data: users });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // GET /api/users/:id - Get a Single User
    app.get("/api/users/:id", async (req, res) => {
      try {
        const row = await db.get("SELECT * FROM users WHERE id = ?", [req.params.id]);
        if (!row) {
          return res.status(404).json({ error: "User not found" });
        }
        // Assemble nested user object
        const user = {
          id: row.id,
          name: row.name,
          username: row.username,
          email: row.email,
          phone: row.phone,
          website: row.website,
          address: {
            street: row.street,
            suite: row.suite,
            city: row.city,
            zipcode: row.zipcode,
            geo: {
              lat: row.geo_lat,
              lng: row.geo_lng
            }
          },
          company: {
            name: row.company_name,
            catchPhrase: row.company_catchPhrase,
            bs: row.company_bs
          }
        };
        res.status(200).json({ data: user });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // POST /api/users - Create a New User
    app.post("/api/users", async (req, res) => {
      console.log("POST /api/users body:", req.body);
      const { name, username, email, phone, website, address, company } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required fields." });
      }
      const {
        street = null,
        suite = null,
        city = null,
        zipcode = null,
        geo = {}
      } = address || {};
      const {
        lat: geo_lat = null,
        lng: geo_lng = null
      } = geo || {};
      const {
        name: company_name = null,
        catchPhrase: company_catchPhrase = null,
        bs: company_bs = null
      } = company || {};
      try {
        const result = await db.run(
          `INSERT INTO users (name, username, email, phone, website, street, suite, city, zipcode, geo_lat, geo_lng, company_name, company_catchPhrase, company_bs) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [name, username, email, phone, website, street, suite, city, zipcode, geo_lat, geo_lng, company_name, company_catchPhrase, company_bs]
        );
        res.status(201).json({ id: result.lastID });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });

    // PUT /api/users/:id - Update a User
    app.put("/api/users/:id", async (req, res) => {
      const { name, username, email, phone, website, address, company } = req.body;
      const { street, suite, city, zipcode, geo: { lat: geo_lat, lng: geo_lng } = {} } = address || {};
      const { name: company_name, catchPhrase: company_catchPhrase, bs: company_bs } = company || {};
      try {
        const result = await db.run(
          `UPDATE users SET name = ?, username = ?, email = ?, phone = ?, website = ?, street = ?, suite = ?, city = ?, zipcode = ?, geo_lat = ?, geo_lng = ?, company_name = ?, company_catchPhrase = ?, company_bs = ? WHERE id = ?`,
          [name, username, email, phone, website, street, suite, city, zipcode, geo_lat, geo_lng, company_name, company_catchPhrase, company_bs, req.params.id]
        );
        if (result.changes === 0) {
          return res.status(404).json({ error: "User not found" });
        }
        // Fetch the updated user
        const updatedRow = await db.get("SELECT * FROM users WHERE id = ?", [req.params.id]);
        const updatedUser = {
          id: updatedRow.id,
          name: updatedRow.name,
          username: updatedRow.username,
          email: updatedRow.email,
          phone: updatedRow.phone,
          website: updatedRow.website,
          address: {
            street: updatedRow.street,
            suite: updatedRow.suite,
            city: updatedRow.city,
            zipcode: updatedRow.zipcode,
            geo: {
              lat: updatedRow.geo_lat,
              lng: updatedRow.geo_lng
            }
          },
          company: {
            name: updatedRow.company_name,
            catchPhrase: updatedRow.company_catchPhrase,
            bs: updatedRow.company_bs
          }
        };
        res.status(200).json(updatedUser);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });

    // DELETE /api/users/:id - Delete a User
    app.delete("/api/users/:id", async (req, res) => {
      try {
        const result = await db.run('DELETE FROM users WHERE id = ?', req.params.id);
        if (result.changes === 0) {
          return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}/`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
