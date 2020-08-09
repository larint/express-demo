import { Router, Request, Response, NextFunction } from 'express'
import { middlewareNotLogin } from '../middleware/auth'
import { DB } from '../helpers/db'
import { News } from '../models/news'
const router = Router()

router.get('/list/page/:page?', middlewareNotLogin, async (req: Request, res: Response) => {
	let from = req.params.page || 1

	let paginate = await DB.paginateByParams({
		table: 'news',
		select: '*',
		where: [1],
		set: "?",
		page: from as number,
		itemOnPage: 10
	})

	res.render('news/list', { data: paginate })
}).get('/create', middlewareNotLogin, async (req: Request, res: Response) => {
	res.render('news/create')
}).get('/:id/edit', middlewareNotLogin, async (req: Request, res: Response) => {
	let news = await DB.selectByParams({
		select: '*',
		table: 'news',
		where: ['id', req.params.id],
		set: '?? = ?'
	})
	if (news.length == 0) {
		return res.render('404')
	}
	res.render('news/edit', { news: news[0] })
}).post('/create', middlewareNotLogin, async (req: Request, res: Response) => {
	let news: News = req.body

	if (!news.title || !news.content) {
		return res.render('index', { error: 'Chưa nhập đủ thông tin', old_data: news })
	} else {

		let isAdded = await DB.insertItem({
			table: 'news',
			where: ['title', news.title, 'content', news.content],
			set: '?? = ?,?? = ?'
		})

		if (isAdded) {
			return res.render('index', { success: 'Đã thêm thành công!' })
		}
		res.send('Thêm dữ liệu không thành công!')
	}
}).put('/update', middlewareNotLogin, async (req: Request, res: Response) => {
	let news: News = req.body

	let isUpdate = await DB.updateItem({
		table: 'news',
		where: ['title', news.title, 'content', news.content, 'id', news.id],
		set: '?? = ?, ?? = ?'
	})

	if(isUpdate) {
		return res.redirect(`/news/${news.id}/edit`)
	}
	res.send('Cập nhật không thành công!')
}).delete('/delete', middlewareNotLogin, async (req: Request, res: Response) => {
	let news: News = req.body

	let isDelete = await DB.deleteItem({
		table: 'news',
		where: ['id', news.id],
		set: '?? = ?'
	})

	if(isDelete) {
		return res.redirect('back')
	}
	res.send('Xoá không thành công!')
})

export { router }