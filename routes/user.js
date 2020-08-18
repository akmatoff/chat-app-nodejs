const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// Signup route
router.post('/signup', (req, res, next) => {
    User.findOne({ where: { username: req.body.username } }).then(user => {
        if (user != null) {
            return res.status(409).json({
                error: "User already exists"
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err.message
                    });
                } else {
                    const user = User.build({
                        username: req.body.username,
                        password: hash
                    });
                    user.save().then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created'
                        });
                    })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err.message
                            })
                        })
                }
            });
        }
    })
});

// Login route
router.post('/login', (req, res) => {
    User.findOne({ where: { username: req.body.username } })
        .then(user => {
            if (user === null) {
                return res.status(404).json({
                    message: "User not found"
                })
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Authorization failed'
                    });
                }

                if (result) {
                    const token = jwt.sign({
                        userID: user.user_id,
                        username: user.username
                    }, process.env.JWT_KEY, {
                        expiresIn: "1h"
                    })
                    return res.status(200).json({
                        message: 'Successful authorization',
                        token: token
                    });
                } else {
                    return res.status(401).json({
                        message: 'Authorization failed'
                    });
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;