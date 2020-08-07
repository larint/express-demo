import * as express from 'express'
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as morgan from 'morgan'
import * as path from 'path'
import * as fs from 'fs'
import * as session from 'express-session'

import './helpers/db'

//router
import { router as indexRouter } from './routes/index'
import { router as authRouter } from './routes/auth'
import { router as newsRouter } from './routes/news'

require('dotenv').config()

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var appLogStream = fs.createWriteStream(path.join(__dirname, 'app.log'), { flags: 'a' })
app.use(morgan('combined', { stream: appLogStream, skip: (req, res) => { return res.statusCode < 400 } }))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "bjhbahsbdjabwdhjbwjdh", resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));

// pass user to all template
app.use(function(req, res, next) {
	res.locals.user = req.session?.user || null
	next()
});

app.use(/\/(app.js|package.json)/, (req: Request, res: Response) => res.render('404'))
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/news', newsRouter);


// // error handler
// app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
// 	// set locals, only providing error in development
// 	res.locals.message = err.toString;
// 	res.locals.error = process.env.APP_ENV === 'dev' ? err : {};

// 	// render the error page
// 	res.status(404);
// 	res.render('error');
// });

app.listen(3000, () => console.log('listening @ 3000', new Date()))
