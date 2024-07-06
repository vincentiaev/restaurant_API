const express = require('express');
const conn = require('../db');
const bcrypt = require('bcrypt');
const router = express.Router();

//create account
router.post('/create_account', async function (req, res) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        let userData = {
            username: req.body.username,
            password: hashedPassword,
            nama: req.body.nama,
            alamat: req.body.alamat,
            hp: req.body.hp
        };

        let checkUsernameQuery = "SELECT * FROM user WHERE username = ?";
        conn.query(checkUsernameQuery, userData.username, function (err, result) {
            if (result.length == 0) {
                let createAccountQuery = "INSERT into user SET ?";
                conn.query(createAccountQuery, userData, function (err, result) {
                    if (err) throw err;
                    res.send(JSON.stringify(
                        {
                            "status": 200,
                            "error": null,
                            "response": result
                        }
                    ))
                });
            } else {
                res.send(JSON.stringify(
                    {
                        "status": 403,
                        "error": "Username already exists",
                        "response": null
                    }
                ));
            }
        });
    } catch (err) {
        res.status(500).send(err);
    }
});



//update akun
router.put('/update/:id', function(req, res){
    let updateUserQuery = "UPDATE user SET ";
    if (req.body.password) {
        updateUserQuery += "password='" + req.body.password + "', ";
    }
    if (req.body.nama) {
        updateUserQuery += "nama='" + req.body.nama + "', ";
    }
    if (req.body.alamat) {
        updateUserQuery += "alamat='" + req.body.alamat + "', ";
    }
    if (req.body.hp) {
        updateUserQuery += "hp='" + req.body.hp + "', ";
    }

    updateUserQuery = updateUserQuery.slice(0, -2);

    updateUserQuery += " WHERE user_id=" + req.params.id;

    console.log(updateUserQuery);
    conn.query(updateUserQuery, function (err, result) {
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