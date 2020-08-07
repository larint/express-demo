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
	static selectByParams = async (params: Params): Promise<any[] | mysql.MysqlError | any> => await DB.exeQuery(mysql.format(`SELECT ${params.select} FROM ${params.table} WHERE ${params.set}`, params.where))
	static insertItem = async (params: Params): Promise<any[] | mysql.MysqlError | any> => await DB.exeQuery(mysql.format(`INSERT INTO ${params.table} SET ${params.set}`, params.where))
	static updateItem = async (params: Params): Promise<any[] | mysql.MysqlError | any> => await DB.exeQuery(mysql.format(`UPDATE ${params.table} SET ${params.set} WHERE ?? = ?`, params.where))
	static deleteItem = async (params: Params): Promise<any[] | mysql.MysqlError | any> => await DB.exeQuery(mysql.format(`DELETE FROM ${params.table} WHERE ${params.set}`, params.where))

}