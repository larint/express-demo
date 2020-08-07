import { Router, Request, Response, NextFunction } from 'express'
import { middlewareNotLogin } from '../middleware/auth'
import { DB } from '../helpers/db'
import { News } from '../models/news'

const router = Router()

router.get('/list', async (req: Request, res: Response) => {
	let news = await DB.selectBySql('select * from news')

	res.render('news/list', { news: news })
}).get('/create', async (req: Request, res: Response) => {
	res.render('news/create')
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
	}


	res.send('loi tao bai viet')
})

export { router }