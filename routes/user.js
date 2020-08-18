const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

// POST REQUEST TO SIGNUP ROUTE
router.post('/signup', (req, res) => {
    User.findOne({ where: { username: req.body.username } }).then(user => {
        // If user found
        if (user === null) {
            return res.status(409).json({
                message: "User already exists"
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = User.build({
                        username: req.body.username,
                        password: hash
                    });
                    user.save().then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "User created"
                        });
                    })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            })
        }
    })
});

module.exports = router;