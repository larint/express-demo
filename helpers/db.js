"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const mysql = require("mysql");
require('dotenv').config();
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_DB,
    timezone: process.env.DB_TIMEZONE,
});
connection.connect(function (err) {
    if (err)
        throw err;
    console.log("Connected!");
});
class DB {
}
exports.DB = DB;
DB.exeQuery = (sql) => {
    console.log(sql);
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result, fields) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
};
DB.selectBySql = async (sql) => await DB.exeQuery(sql);
DB.paginateByParams = async (params) => {
    let record = await DB.exeQuery(`select count(*) as total from ${params.table}`);
    let total = record.length > 0 ? record[0].total : 0;
    let itemOnPage = params.itemOnPage || total;
    let totalPage = Math.ceil(total / itemOnPage);
    let currentPage = params.page || 1;
    let from = (currentPage - 1) * itemOnPage;
    let dataSelect = await DB.exeQuery(mysql.format(`SELECT ${params.select} FROM ${params.table} WHERE ${params.set} ORDER BY id DESC LIMIT ${from}, ${itemOnPage}`, params.where));
    let paginate = {
        total: total,
        totalPage: totalPage,
        link: '',
        currentPage: currentPage,
        data: dataSelect
    };
    return paginate;
};
DB.selectByParams = async (params) => {
    let limit = '';
    if (params.limit) {
        limit = `LIMIT ${params.limit}`;
    }
    return await DB.exeQuery(mysql.format(`SELECT ${params.select} FROM ${params.table} WHERE ${params.set} ${limit}`, params.where));
};
DB.insertItem = async (params) => await DB.exeQuery(mysql.format(`INSERT INTO ${params.table} SET ${params.set}`, params.where));
DB.updateItem = async (params) => await DB.exeQuery(mysql.format(`UPDATE ${params.table} SET ${params.set} WHERE ?? = ?`, params.where));
DB.deleteItem = async (params) => await DB.exeQuery(mysql.format(`DELETE FROM ${params.table} WHERE ${params.set}`, params.where));
