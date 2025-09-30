// server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = 5000;
app.use(cors());
app.use(bodyParser.json());
const db = new sqlite3.Database("./edna.db", (err) => {
 if (err) console.error("Error opening database:", err.message);
 else {
 console.log("Connected to SQLite database.");
 db.run(`CREATE TABLE IF NOT EXISTS records (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT,
 age INTEGER,
 species TEXT,
 cause TEXT,
 sampleId TEXT,
 blood TEXT,
 yob INTEGER
 )`);
 db.run(`CREATE TABLE IF NOT EXISTS reports (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT,
 age INTEGER,
 species TEXT,
 cause TEXT,
 blood TEXT,
 yob INTEGER,
 matchPercent INTEGER
 )`);
 }
});
app.get("/records", (req, res) => {
 db.all("SELECT * FROM records", [], (err, rows) => {
 if (err) return res.status(500).json({ error: err.message });
 res.json(rows);
 });
});
app.post("/records", (req, res) => {
 const { name, age, species, cause, sampleId, blood, yob } = req.body;
 db.run(
 `INSERT INTO records (name, age, species, cause, sampleId, blood, yob) VALUES (?, ?, ?, ?, ?, ?, ?)`,
 [name, age, species, cause, sampleId, blood, yob],
 function (err) {
 if (err) return res.status(500).json({ error: err.message });
 res.json({ id: this.lastID, ...req.body });
 }
 );
});
app.get("/reports", (req, res) => {
 db.all("SELECT * FROM reports", [], (err, rows) => {
 if (err) return res.status(500).json({ error: err.message });
 res.json(rows);
 });
});
app.post("/reports", (req, res) => {
 const { name, age, species, cause, blood, yob, matchPercent } = req.body;
 db.run(
 `INSERT INTO reports (name, age, species, cause, blood, yob, matchPercent) VALUES (?, ?, ?, ?, ?, ?, ?)`,
 [name, age, species, cause, blood, yob, matchPercent],
 function (err) {
 if (err) return res.status(500).json({ error: err.message });
 res.json({ id: this.lastID, ...req.body });
 }
 );
});
app.listen(PORT, () => {
 console.log(`Server running at http://localhost:${PORT}`);
});
