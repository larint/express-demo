import * as mysql from 'mysql'

require('dotenv').config()

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PW,
	database: process.env.DB_DB,
	timezone: process.env.DB_TIMEZONE,
})

connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});

export interface Params {
	table: string,
	where: (string | number | boolean | Date)[],
	set?: string,
	select?: string,
	limit?: string,
	page?: number,
	itemOnPage?: number
}

export interface Paginate {
	total: number,
	link: string,
	currentPage: number,
	totalPage: number,
	data: Array<any>
}


export class DB {

	static exeQuery = (sql: string): Promise<any> => {
		console.log(sql)
		return new Promise((resolve, reject) => {
			connection.query(sql, (err: mysql.MysqlError, result, fields) => {
				if (err)
					reject(err);
				else
					resolve(result)
			})
		})
	}

	static selectBySql = async (sql: string): Promise<any[] | mysql.MysqlError | any> => await DB.exeQuery(sql)
	static paginateByParams = async (params: Params) => {
		let record = await DB.exeQuery(`select count(*) as total from ${params.table}`)
		
		let total: number = record.length > 0 ? record[0].total : 0
		let itemOnPage = params.itemOnPage || total
		let totalPage: number = Math.ceil(total/itemOnPage)
		let currentPage: number = params.page || 1
		let from: number = (currentPage - 1) * itemOnPage

		let dataSelect = await DB.exeQuery(mysql.format(`SELECT ${params.select} FROM ${params.table} WHERE ${params.set} ORDER BY id DESC LIMIT ${from}, ${itemOnPage}`, params.where))

		let paginate: Paginate = {
			total: total,
			totalPage: totalPage,
			link: '',
			currentPage: currentPage,
			data: dataSelect
		}

		return paginate
	}
	static selectByParams = async (params: Params): Promise<any[] | mysql.MysqlError | any> => {
		let limit:string | number = ''
		if(params.limit) {
			limit = `LIMIT ${params.limit}`		
		}
		return await DB.exeQuery(mysql.format(`SELECT ${params.select} FROM ${params.table} WHERE ${params.set} ${limit}`, params.where))
	}
	static insertItem = async (params: Params): Promise<any[] | mysql.MysqlError | any> => await DB.exeQuery(mysql.format(`INSERT INTO ${params.table} SET ${params.set}`, params.where))
	static updateItem = async (params: Params): Promise<any[] | mysql.MysqlError | any> => await DB.exeQuery(mysql.format(`UPDATE ${params.table} SET ${params.set} WHERE ?? = ?`, params.where))
	static deleteItem = async (params: Params): Promise<any[] | mysql.MysqlError | any> => await DB.exeQuery(mysql.format(`DELETE FROM ${params.table} WHERE ${params.set}`, params.where))

}