const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const main_router = require('./routes/main');
const login = require('./routes/login');
const mongoConnect = require('./util/db').mongoConnect;
const jwt = require('jsonwebtoken')

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const secret_token_ = "21vcFe3dg7hz16f3";

const authUser = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) return res.status(200).json({ err: "No access" })
    jwt.verify(token, secret_token_, (err, user) => {
        if (err) return res.status(200).json({ err: "No access" })
        req.user = user
        next()
    })

}


app.use(login);
app.use(authUser, main_router);


mongoConnect(() => {
    app.listen(3000, () => {
        console.log("Serwer chodzi!");
    });
});