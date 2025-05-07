"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helper_1 = require("../utils/helper");
const constant_1 = require("../constant");
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.json((0, helper_1.sendResponse)({ message: "Access Denied: No token provided", code: 401, status: false }));
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.json((0, helper_1.sendResponse)({ message: "Invalid token", code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.FORBIDDEN, status: false }));
    }
};
exports.authenticate = authenticate;
