"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateSocket = exports.authenticate = void 0;
exports.getUserFromSocket = getUserFromSocket;
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
const authenticateSocket = (socket, next) => {
    var _a, _b;
    const token = ((_a = socket.handshake.auth.token) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || ((_b = socket.handshake.headers.token) === null || _b === void 0 ? void 0 : _b.split(" ")[1]);
    if (!token) {
        return next(new Error("Access Denied: No token provided"));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    }
    catch (err) {
        return next(new Error("Invalid token"));
    }
};
exports.authenticateSocket = authenticateSocket;
function getUserFromSocket(socket) {
    if (!socket.user || !socket.user.user_id) {
        throw new Error("User not found on socket");
    }
    return socket.user;
}
