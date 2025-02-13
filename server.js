const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// إعداد قاعدة البيانات
const db = new sqlite3.Database('./data/locations.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to SQLite database.');
});

// إنشاء جدول إذا لم يكن موجودًا
db.run(`CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT,
    latitude REAL,
    longitude REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// API لاستقبال البيانات
app.post('/location', (req, res) => {
    const { device_id, latitude, longitude } = req.body;
    if (!device_id || !latitude || !longitude) {
        return res.status(400).send('Missing fields');
    }
    db.run(`INSERT INTO locations (device_id, latitude, longitude) VALUES (?, ?, ?)`,
        [device_id, latitude, longitude],
        (err) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error saving data');
            } else {
                res.status(200).send('Data saved successfully');
            }
        }
    );
});

// API لجلب البيانات
app.get('/locations', (req, res) => {
    db.all(`SELECT * FROM locations ORDER BY timestamp DESC`, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error fetching data');
        } else {
            res.json(rows);
        }
    });
});

// بدء الخادم
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
