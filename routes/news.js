"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const db_1 = require("../helpers/db");
const router = express_1.Router();
exports.router = router;
router.get('/list/page/:page?', auth_1.middlewareNotLogin, async (req, res) => {
    let from = req.params.page || 1;
    let paginate = await db_1.DB.paginateByParams({
        table: 'news',
        select: '*',
        where: [1],
        set: "?",
        page: from,
        itemOnPage: 10
    });
    res.render('news/list', { data: paginate });
}).get('/create', auth_1.middlewareNotLogin, async (req, res) => {
    res.render('news/create');
}).get('/:id/edit', auth_1.middlewareNotLogin, async (req, res) => {
    let news = await db_1.DB.selectByParams({
        select: '*',
        table: 'news',
        where: ['id', req.params.id],
        set: '?? = ?'
    });
    if (news.length == 0) {
        return res.render('404');
    }
    res.render('news/edit', { news: news[0] });
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
        res.send('Thêm dữ liệu không thành công!');
    }
}).put('/update', auth_1.middlewareNotLogin, async (req, res) => {
    let news = req.body;
    let isUpdate = await db_1.DB.updateItem({
        table: 'news',
        where: ['title', news.title, 'content', news.content, 'id', news.id],
        set: '?? = ?, ?? = ?'
    });
    if (isUpdate) {
        return res.redirect(`/news/${news.id}/edit`);
    }
    res.send('Cập nhật không thành công!');
});
