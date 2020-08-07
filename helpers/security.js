"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Security = void 0;
const bcrypt = require("bcrypt");
const saltRounds = 10;
class Security {
}
exports.Security = Security;
Security.createHash = async (data) => {
    return await bcrypt.hash(data, saltRounds);
};
Security.comparePassword = async (data, hash) => {
    return await bcrypt.compare(data, hash);
};
