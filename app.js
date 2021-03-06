"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const methodOverride = require("method-override");
require("./helpers/db");
const index_1 = require("./routes/index");
const auth_1 = require("./routes/auth");
const news_1 = require("./routes/news");
require('dotenv').config();
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
var appLogStream = fs.createWriteStream(path.join(__dirname, 'app.log'), { flags: 'a' });
app.use(morgan('combined', { stream: appLogStream, skip: (req, res) => { return res.statusCode < 400; } }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({ secret: "bjhbahsbdjabwdhjbwjdh", resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    var _a;
    res.locals.user = ((_a = req.session) === null || _a === void 0 ? void 0 : _a.user) || null;
    res.locals.site_url = process.env.URI_PATH;
    next();
});
app.use(/\/(app.js|package.json)/, (req, res) => res.render('404'));
app.use('/', index_1.router);
app.use('/auth', auth_1.router);
app.use('/news', news_1.router);
app.listen(3000, () => console.log('listening @ 3000', new Date()));
