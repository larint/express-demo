import { Router, Request, Response, NextFunction } from 'express'
import { middlewareNotLogin } from '../middleware/auth'

const router = Router()

router.get('/', middlewareNotLogin, async (req: Request, res: Response) => {
	res.render('index')
}).post('/createNew', (req: Request, res: Response) => {

})

export { router }