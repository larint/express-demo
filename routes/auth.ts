import { Router, Request, Response } from 'express'
import { Auth } from '../services/auth'
import { Credentials } from '../helpers/type'
import { middlewareLogined } from '../middleware/auth'

const router = Router()

router.get('/login', middlewareLogined, (req: Request, res: Response) => {
	res.render('login')
}).post('/login', async (req: Request, res: Response) => {
	if (!req.body.email || !req.body.password) {
		return res.render('login', { error: "Chưa nhập thông tin đăng nhập" });
	} else {
		let credentials: Credentials = { username: req.body.email, password: req.body.password }
		let checkLogin = await Auth.authenticate(credentials)

		if (checkLogin) {
			req.session!.user = credentials
			res.redirect('/');
		} else {
			res.render('login', { error: "Đăng nhập không thành công!" });
		}
	}

}).get('/logout', async (req: Request, res: Response) => {
	req.session?.destroy(() => {
		console.log("user logged out.")
	});
	res.redirect('/auth/login');
});

export { router }