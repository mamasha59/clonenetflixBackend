const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require('helmet'); // make secure headers
const rateLimit = require('express-rate-limit');// confine auto requestes from one api
const app = express();
const cookieParser = require("cookie-parser");

const router = require('./routes/routes');
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");

const {PORT = 3001, MONGO_URL = "mongodb://127.0.0.1:27017/mydb"} = process.env;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // for 15 min
    max: 100 // not moore that 100 req
});

mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URL, 
    err => {
    if(err) throw err;
    console.log('connected to MongoDB');
})

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use((req, res, next) => {
    res.header("Acces-Control-Allow-Origin", "*");
    res.header("Acces-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(limiter);

app.use(errors());

app.use(router);
app.use(errorHandler)

app.listen(PORT, ()=>{console.log(`going on ${PORT}`)});