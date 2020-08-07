"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const db_1 = require("../helpers/db");
const router = express_1.Router();
exports.router = router;
router.get('/list', async (req, res) => {
    let news = await db_1.DB.selectBySql('select * from news');
    res.render('news/list', { news: news });
}).get('/create', async (req, res) => {
    res.render('news/create');
}).post('/create', auth_1.middlewareNotLogin, async (req, res) => {
    let news = req.body;
    if (!news.title || !news.content) {
        return res.render('index', { error: 'Chưa nhập đủ thông tin', old_data: news });
    }
    else {
        let isAdded = await db_1.DB.insertItem({
            table: 'news',
            where: ['title', news.title, 'content', news.content],
            set: '?? = ?,?? = ?'
        });
        if (isAdded) {
            return res.render('index', { success: 'Đã thêm thành công!' });
        }
    }
    res.send('loi tao bai viet');
});
