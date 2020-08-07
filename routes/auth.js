"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_1 = require("../services/auth");
const auth_2 = require("../middleware/auth");
const router = express_1.Router();
exports.router = router;
router.get('/login', auth_2.middlewareLogined, (req, res) => {
    res.render('login');
}).post('/login', async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.render('login', { error: "Chưa nhập thông tin đăng nhập" });
    }
    else {
        let credentials = { username: req.body.email, password: req.body.password };
        let checkLogin = await auth_1.Auth.authenticate(credentials);
        if (checkLogin) {
            req.session.user = credentials;
            res.redirect('/');
        }
        else {
            res.render('login', { error: "Đăng nhập không thành công!" });
        }
    }
}).get('/logout', async (req, res) => {
    var _a;
    (_a = req.session) === null || _a === void 0 ? void 0 : _a.destroy(() => {
        console.log("user logged out.");
    });
    res.redirect('/auth/login');
});
