const express = require('express');
const conn = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');
const session = require('express-session');

router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//login
router.post('/login', function (req, res) {
    let loginData = {
        username: req.body.username,
        password: req.body.password
    };

    let authQuery = "SELECT * FROM user WHERE username = ?";
    conn.query(authQuery, [loginData.username], async function (err, result) {
        if (err) throw err;

        if (result.length !== 0) {
            const match = await bcrypt.compare(loginData.password, result[0].password);
            if (match) {
                req.session.user_id = result[0].user_id;
                res.send(JSON.stringify(
                    {
                        "status": 200,
                        "error": null,
                        "response": result
                    }
                ));
            } else {
                res.send(JSON.stringify(
                    {
                        "status": 403,
                        "error": "Wrong username or password",
                        "response": null
                    }
                ));
            }
        } else {
            res.send(JSON.stringify(
                {
                    "status": 403,
                    "error": "Wrong username or password",
                    "response": null
                }
            ));
        }
    });
});


//logout
router.post('/logout', function (req, res) {
    delete req.session.user_id;
    res.send(JSON.stringify({
        "status": 200,
        "message": "Logout successful",
        "response": null
    }));
});

//get user by id
router.get('/user/:id', function(req, res) {
    let getUser = "SELECT * FROM user WHERE user_id = ?";
    conn.query(getUser, [req.params.id], function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": result
        }));
    });
});

module.exports = router;