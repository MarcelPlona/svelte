const express = require('express');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const getDb = require('../util/db').getDb;
const router = express.Router();

const secret_token_ = "21vcFe3dg7hz16f3";


router.post('/api/login', (req, res) => {
    if (req.body.email && req.body.password) {
        const db = getDb();
        db.collection('profile').find({ email: req.body.email}).toArray(function (err, result) {
            if (err) throw err;
            if (result.length) {
                bcrypt.compare(req.body.password, result[0].password)
                        .then(match => {
                            if (match) {
                                const user = { email: req.body.email }
                                const token = jwt.sign(
                                    user,
                                    secret_token_
                                )
                                res.json({ token: token })
                            }
                            else {
                                res.json({ token: false, err: 'Wrong email or password' });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
            }
            else {
                res.json({ token: false, err: 'Wrong email or password' });
            }
        });
    }
    else {
        res.json({ token: false, err: 'Enter email and password' });
    }
})

router.post('/api/register', (req, res) => {
    if (req.body.email && req.body.password && req.body.password2) {
        if (req.body.password2 !== req.body.password){
            return res.json({ res: "n", err:'Passwords are different' });
        }
        const db = getDb();
        db.collection('profile').find({ email: req.body.email }).toArray(function (err, result) {
            if (err) throw err;
            if (!result.length) {
                bcrypt.hash(req.body.password, 12)
                .then(pass => {
                    db.collection('profile').insertOne({ email: req.body.email, password: pass }, function (err, resp) {
                        if (err) throw err;
                        res.json({ res: "y" });
                    });
                })
                .catch(err => {
                    console.log(err);
                })

            }
            else {
                res.json({ res: "n" , err:'This user already exists'});
            }
        });
    }
    else {
        res.json({ res: "n", err:'Enter all forms' })
    }
});

module.exports = router;