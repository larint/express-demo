"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const db_1 = require("../helpers/db");
const security_1 = require("../helpers/security");
class Auth {
}
exports.Auth = Auth;
Auth.authenticate = async (credential) => {
    let user = await db_1.DB.selectByParams({
        select: '*',
        table: 'users',
        where: ['email', credential.username],
        set: '?? = ?'
    });
    if (user.length == 0) {
        return false;
    }
    const match = await security_1.Security.comparePassword(credential.password, user[0].password);
    if (match) {
        return true;
    }
    return false;
};
