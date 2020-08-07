import { Request, Response, NextFunction } from 'express'

let middlewareNotLogin = (req: Request, res: Response, next: NextFunction) => {
	if (req.session?.user) {
		return next()
	}
	return res.redirect('/auth/login')
}

let middlewareLogined = (req: Request, res: Response, next: NextFunction) => {
	if (req.session?.user) {
		return res.redirect('/')
	}
	return next()
}

export { middlewareNotLogin, middlewareLogined }