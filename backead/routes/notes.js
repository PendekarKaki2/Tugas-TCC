const express = require("express");
const router = express.Router();
const db = require("../ds");
const NOTE_FIELDS = "id, judul, isi, tanggal_dibuat";

// GET semua catatan
router.get("/", (req, res) => {
    db.query(`SELECT ${NOTE_FIELDS} FROM notes ORDER BY id DESC`, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// POST tambah catatan
router.post("/", (req, res) => {
    const { judul, isi } = req.body;

    if (!judul || !isi) {
        return res.status(400).json({ message: "judul dan isi wajib diisi" });
    }

    db.query(
        "INSERT INTO notes (judul, isi) VALUES (?, ?)",
        [judul, isi],
        (err, result) => {
            if (err) return res.status(500).json(err);
            db.query(
                `SELECT ${NOTE_FIELDS} FROM notes WHERE id = ?`,
                [result.insertId],
                (selectErr, rows) => {
                    if (selectErr) return res.status(500).json(selectErr);
                    res.status(201).json({
                        message: "Catatan ditambahkan",
                        note: rows[0]
                    });
                }
            );
        }
    );
});

// PUT edit catatan
router.put("/:id", (req, res) => {
    const { judul, isi } = req.body;
    const { id } = req.params;

    if (!judul || !isi) {
        return res.status(400).json({ message: "judul dan isi wajib diisi" });
    }

    db.query(
        "UPDATE notes SET judul=?, isi=? WHERE id=?",
        [judul, isi, id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Catatan tidak ditemukan" });
            }

            db.query(
                `SELECT ${NOTE_FIELDS} FROM notes WHERE id = ?`,
                [id],
                (selectErr, rows) => {
                    if (selectErr) return res.status(500).json(selectErr);
                    res.json({
                        message: "Catatan diupdate",
                        note: rows[0]
                    });
                }
            );
        }
    );
});

// DELETE catatan
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM notes WHERE id=?", [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Catatan dihapus" });
    });
});

module.exports = router;