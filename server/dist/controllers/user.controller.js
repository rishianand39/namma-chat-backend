"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const helper_1 = require("../utils/helper");
const constant_1 = require("../constant");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.user_id;
                const user = yield this.userService.getUser(userId);
                if (!user) {
                    res.json((0, helper_1.sendResponse)({
                        status: false,
                        code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.NOT_FOUND,
                        message: "User not found",
                    }));
                }
                res.json((0, helper_1.sendResponse)({
                    status: true,
                    code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SUCCESS,
                    data: user,
                }));
            }
            catch (err) {
                res.json((0, helper_1.sendResponse)({
                    status: false,
                    code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SERVER_ERROR,
                    message: err.message,
                }));
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.user_id;
                const data = req.body;
                const user = yield this.userService.updateUser({ user_id: userId, data });
                if (!user) {
                    res.json((0, helper_1.sendResponse)({
                        status: false,
                        code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.NOT_FOUND,
                        message: "User not found",
                    }));
                }
                res.json((0, helper_1.sendResponse)({
                    status: true,
                    code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SUCCESS,
                    data: user,
                }));
            }
            catch (err) {
                res.json((0, helper_1.sendResponse)({
                    status: false,
                    code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SERVER_ERROR,
                    message: err.message,
                }));
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.user_id;
                const user = yield this.userService.deleteUser(userId);
                if (!user) {
                    res.json((0, helper_1.sendResponse)({
                        status: false,
                        code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.NOT_FOUND,
                        message: "User not found",
                    }));
                }
                res.json((0, helper_1.sendResponse)({
                    status: true,
                    code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SUCCESS,
                    message: "User deleted successfully",
                    data: user,
                }));
            }
            catch (err) {
                res.json((0, helper_1.sendResponse)({
                    status: false,
                    code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SERVER_ERROR,
                    message: err.message,
                }));
            }
        });
    }
    importContacts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const phoneNumbers = req.body.phone_numbers;
                const userId = req.user.user_id;
                const contacts = yield this.userService.importContacts(userId, phoneNumbers);
                res.json((0, helper_1.sendResponse)({
                    status: true,
                    code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SUCCESS,
                    data: contacts,
                }));
            }
            catch (err) {
                res.json((0, helper_1.sendResponse)({
                    status: false,
                    code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SERVER_ERROR,
                    message: err.message,
                }));
            }
        });
    }
    getContacts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.user_id;
                const contacts = yield this.userService.getContacts(userId);
                res.json((0, helper_1.sendResponse)({
                    status: true,
                    code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SUCCESS,
                    data: contacts,
                }));
            }
            catch (err) {
                res.json((0, helper_1.sendResponse)({
                    status: false,
                    code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SERVER_ERROR,
                    message: err.message,
                }));
            }
        });
    }
    syncContacts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = req.user.user_id;
            if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.phone_numbers)) {
                res.json((0, helper_1.sendResponse)({
                    status: false,
                    message: 'phone_numbers is required',
                    code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.BAD_REQUEST
                }));
            }
            const response = yield this.userService.syncContacts(userId, (_b = req.body) === null || _b === void 0 ? void 0 : _b.phone_numbers);
            res.json((0, helper_1.sendResponse)(response));
        });
    }
}
exports.UserController = UserController;
