"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewareLogined = exports.middlewareNotLogin = void 0;
let middlewareNotLogin = (req, res, next) => {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.user) {
        return next();
    }
    return res.redirect('/auth/login');
};
exports.middlewareNotLogin = middlewareNotLogin;
let middlewareLogined = (req, res, next) => {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.user) {
        return res.redirect('/');
    }
    return next();
};
exports.middlewareLogined = middlewareLogined;
