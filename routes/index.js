"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = express_1.Router();
exports.router = router;
router.get('/', auth_1.middlewareNotLogin, (req, res) => {
    res.render('index');
}).post('/createNew', (req, res) => {
});
