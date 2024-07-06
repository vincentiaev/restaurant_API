const express = require('express');
const conn = require('../db');
const router = express.Router();
const moment = require('moment-timezone');

//place order
router.post('/order', function (req, res) {
    const orderDetail = req.body.order_detail;
    const menuIds = Object.keys(orderDetail);

    const getMenuQuery = "SELECT menu_id, harga FROM menu WHERE menu_id IN (?)";
    conn.query(getMenuQuery, [menuIds], function (err, results) {
        if (err) {
            console.error("Error querying menu prices:", err);
            return res.status(500).json({
                status: 500,
                error: "Internal Server Error",
                response: null
            });
        }

        // Create an object to store the prices of each menu item
        const menuPrices = {};
        results.forEach(menu => {
            menuPrices[menu.menu_id] = menu.harga;
        });

        // Calculate the total order price based on the menu prices and quantities ordered
        let totalHarga = 0;
        Object.entries(orderDetail).forEach(([menuId, quantity]) => {
            totalHarga += menuPrices[menuId] * quantity;
        });

        // Get the current date and time with timestamp in GMT+7
        let currentDate = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

        let orderData = {
            tgl_order: currentDate,
            order_detail: JSON.stringify(orderDetail),
            alamat_pengiriman: req.body.alamat_pengiriman,
            total_harga: totalHarga,
            status: "Menunggu konfirmasi",
            user_id: req.body.user_id
        };

        let placeOrderQuery = "INSERT INTO order_list SET ?";
        console.log(placeOrderQuery);
        conn.query(placeOrderQuery, orderData, function (err, result) {
            if (err) {
                console.error("Error placing order:", err);
                return res.status(500).json({
                    status: 500,
                    error: "Internal Server Error",
                    response: null
                });
            }
            res.status(200).json({
                status: 200,
                error: null,
                response: result
            });
        });
    });
});



//retrieve all order
router.get('/order', function (req, res) {
        let getAllOrder = "SELECT * FROM order_list";
        conn.query(getAllOrder, function (err, result) {
            if (err) throw err;
            res.send(JSON.stringify(
                {
                    "status": 200,
                    "error": null,
                    "response": result
                }
            ));
        });
});

//retrieve order by user_id
router.get('/order/:id', function (req, res) {
    let getUserOrderQuery = "SELECT * FROM order_list WHERE user_id =" + req.params.id;
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

//update order status
router.put('/order/:id', function(req, res){
    let updateStatus = "UPDATE order_list SET status='" + req.body.status + "' WHERE order_id=" + req.params.id;
    conn.query(updateStatus, function (err, result) {
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

//retrieve order by date
router.get('/order/date/:date', function(req, res) {
    let getOrderByDate = "SELECT * FROM order_list WHERE DATE(tgl_order) = ?";
    conn.query(getOrderByDate, [req.params.date], function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": result
        }));
    });
});

//retrieve order by date and status
router.get('/order/:date/:status', function(req, res){
    let date = req.params.date;
    let status = req.params.status;
    
    let query = "SELECT * FROM order_list WHERE DATE(tgl_order) = ? AND status = ?";
    
    conn.query(query, [date, status], function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify(
            {
                "status": 200,
                "error": null,
                "response": result
            }
        ));
    });
});

//retrieve ongoing order pakai parameter tanggal hari itu, user id, dan order dengan status bukan pesanan selesai 
router.get('/ongoing/:date/:id', function(req, res){
    let date = req.params.date;
    let id = req.params.id;

    let query = "SELECT * FROM order_list WHERE DATE(tgl_order) = ? AND status <> 'Pesanan selesai' AND user_id = ?";
    
    conn.query(query, [date, id], function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify(
            {
                "status": 200,
                "error": null,
                "response": result
            }
        ));
    });
});


module.exports = router;