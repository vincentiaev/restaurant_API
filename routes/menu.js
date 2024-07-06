const express = require('express');
const multer = require('multer');
var fs = require('fs');
const path = require('path');
const conn = require('../db');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });

//retrieve all menu
router.get('/menu', function (req, res) {
    let getMenuQuery = "SELECT * FROM menu";
    conn.query(getMenuQuery, function (err, rows) {
        if (err) throw err;
        let menuWithImageURL = rows.map(row => {
            return {
                menu_id: row.menu_id,
                nama_menu: row.nama_menu,
                deskripsi: row.deskripsi,
                harga: row.harga,
                gambar: `upload/${row.gambar}`
            };
        });

        res.send(JSON.stringify(
            {
                "status": 200,
                "error": null,
                "response": menuWithImageURL
            }
        ));
    });
});

//retrieve menu by id
router.get('/menu/:id', function (req, res) {
    let getMenuByIdQuery = "SELECT * FROM menu WHERE menu_id = ?";
    conn.query(getMenuByIdQuery, [req.params.id], function (err, rows) {
        if (err) throw err;

        if (rows.length === 0) {
            res.send(JSON.stringify({
                "status": 404,
                "error": "Menu not found",
                "response": null
            }));
        } else {
            let menuWithImageURL = {
                nama_menu: rows[0].nama_menu,
                deskripsi: rows[0].deskripsi,
                harga: rows[0].harga,
                gambar: `upload/${rows[0].gambar}`
            };

            res.send(JSON.stringify({
                "status": 200,
                "error": null,
                "response": menuWithImageURL
            }));
        }
    });
});

//create menu
router.post('/menu', upload.single('gambar'), function (req, res) {
    let menuData = {
        nama_menu: req.body.nama_menu,
        deskripsi: req.body.deskripsi,
        harga: req.body.harga,
        gambar: req.file.filename
    };
    let createMenuQuery = "INSERT into menu SET ?";
    conn.query(createMenuQuery, menuData, function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify(
            {
                "status": 200,
                "error": null,
                "response": result
            }
        ))
    });
});

//update menu
router.put('/menu/:id', upload.single('gambar'), function(req, res){
    let updateMenuQuery = "UPDATE menu SET ";
    if (req.body.nama_menu) {
        updateMenuQuery += "nama_menu='" + req.body.nama_menu + "', ";
    }
    if (req.body.deskripsi) {
        updateMenuQuery += "deskripsi='" + req.body.deskripsi + "', ";
    }
    if (req.body.harga) {
        updateMenuQuery += "harga='" + req.body.harga + "', ";
    }
    if (req.file) { 
        updateMenuQuery += "gambar='" + req.file.filename + "', ";
    }
    updateMenuQuery = updateMenuQuery.slice(0, -2);

    updateMenuQuery += " WHERE menu_id=" + req.params.id;

    conn.query(updateMenuQuery, function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify(
            {
                "status": 200,
                "error": null,
                "response": result
            }
        ))
    })
});


//delete menu
router.delete('/menu/:id', function (req, res) {
    let deleteMenuQuery = "DELETE FROM menu WHERE menu_id=" + req.params.id;
    conn.query(deleteMenuQuery, function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify(
            {
                "status": 200,
                "error": null,
                "response": result
            }
        ))
    })
});

module.exports = router;