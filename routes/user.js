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
                        username: user.username,
                        about: user.about
                    }, process.env.JWT_KEY, {
                        expiresIn: "20d"
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

// Get filtered data
router.get('/users', (req, res) => {
  User.findAll({ attributes: ['user_id', 'username', 'about'] }).then(users => {
    var data;

    const filterUsers = (query) => {
      var filteredUsers = [];
      for (user in users) {
        if (users[user].username.toLowerCase().startsWith(query.username.toLowerCase())) {
          filteredUsers.push(users[user]);
        } 
      }
      return filteredUsers;
    }
    if (req.query.username != null) {
      data = {
        users: filterUsers(req.query)
      }; 
    } else {
      data = {
        users: users
      };
    }
    
    res.status(200).json(data);
  });
});

module.exports = router;