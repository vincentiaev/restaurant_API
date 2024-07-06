const express = require('express');
const conn = require('../db');
const router = express.Router();

// Add to cart
router.post('/cart', function (req, res) {
    let menuData = {
        menu_id: req.body.menu_id,
        jumlah: req.body.jumlah,
        user_id: req.body.user_id
    };
    
    let checkQuery = "SELECT * FROM cart WHERE user_id = ? AND menu_id = ?";
    conn.query(checkQuery, [menuData.user_id, menuData.menu_id], function (err, result) {
        if (err) throw err;
        
        if (result.length > 0) {
            // If exists, update jumlah
            let updateQuery = "UPDATE cart SET jumlah = jumlah + ? WHERE user_id = ? AND menu_id = ?";
            conn.query(updateQuery, [menuData.jumlah, menuData.user_id, menuData.menu_id], function (err, result) {
                if (err) throw err;
                res.send(JSON.stringify({
                    "status": 200,
                    "error": null,
                    "response": result
                }));
            });
        } else {
            // If not exists, tambah cart baru di database
            let createMenuQuery = "INSERT INTO cart SET ?";
            conn.query(createMenuQuery, menuData, function (err, result) {
                if (err) throw err;
                res.send(JSON.stringify({
                    "status": 200,
                    "error": null,
                    "response": result
                }));
            });
        }
    });
});


//retrieve cart by user_id
router.get('/cart/:id', function (req, res) {
    let getUserOrderQuery = "SELECT * FROM cart WHERE user_id =" + req.params.id;
    conn.query(getUserOrderQuery, function (err, result) {
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

//delete cart id
router.delete('/cart/:id', function (req, res) {
    let deleteCartId = "DELETE FROM cart WHERE cart_id=" + req.params.id;
    conn.query(deleteCartId, function (err, result) {
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

// update to cart
router.put('/cart/:id', function (req, res) {
    let menuData = {
        cart_id: req.params.id, 
        jumlah: req.body.jumlah,
    };

    let updateQuery = "UPDATE cart SET jumlah = ? WHERE cart_id = ?";
    conn.query(updateQuery, [menuData.jumlah, menuData.cart_id], function (err, result) {
        if (err) {
            res.status(500).json({
                status: 500,
                error: err.message,
                response: null
            });
            return;
        }

        // Memastikan hasil update terjadi
        if (result.affectedRows === 0) {
            res.status(404).json({
                status: 404,
                error: "Cart ID not found",
                response: null
            });
            return;
        }

        res.status(200).json({
            status: 200,
            error: null,
            response: result
        });
    });
});


//delete cart by user id
router.delete('/cart/del/:id', function (req, res) {
    let deleteCartUserId = "DELETE FROM cart WHERE user_id=" + req.params.id;
    conn.query(deleteCartUserId, function (err, result) {
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
