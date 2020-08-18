const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post('/signup', (req, res) => {
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

module.exports = router;