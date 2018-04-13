const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/user');
const connection = require('../models/config');
const checkAuth = require('../middleware/checkAuth');

router.post('/signup', (req, res, next) => {
    connection.query("SELECT count(*) from users WHERE name='"+req.body.name+"';", {type: connection.QueryTypes.Select})
    .then( function(count){
        if(Number(count[0][0].count)>=1){
            res.status(409).json({
                error: 'username "'+req.body.name+'" already exist'
            })
        }else{
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    if(err){
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    }else{
                        New_User = User.create({ 
                            name: req.body.name, 
                            password: hash })
                            .then(function(user) {
                                res.status(201).json({
                                    message: 'User successfully been created',
                                    username: req.body.name,  
                                });
                            });
                    }            
                });
            });
        }
    });
    
});



router.post('/login', (req, res, next) =>{
    connection.query("SELECT count(*) from users WHERE name='"+req.body.name+"';", {type: connection.QueryTypes.Select})
    .then( count =>{
        if(Number(count[0][0].count)<1){
            console.log(count[0][0].count)
            return res.status(401).json({
                message: 'Authentication failed'
            });
        }

        User.findAll({
            where: {
                name: req.body.name
            }
        }).then(result =>{
            hash = result[0].password;
            const token = jwt.sign(
                {
                    name: result[0].name
                },
                 'secret_key', 
                {
                    expiresIn: "24h"
                }

            );

            bcrypt.compare(req.body.password, hash, function(err, result) {
                if(err){
                    return res.status(401).json({
                        message: 'Authentication failed'
                    });
                }
                if(result){
                    return res.status(200).json({
                        message: 'Authentication successful',
                        token: token
                    });
                }
    
                return res.status(401).json({
                    message: 'Authentication failed'
                });
            });
        })        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    }); 
});


router.get('/', checkAuth, (req, res, next) =>{
    res.json({
        message: 'all right!'
    });
});

module.exports = router;