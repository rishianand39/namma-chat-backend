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
exports.AuthController = void 0;
const helper_1 = require("../utils/helper");
const constant_1 = require("../constant");
// private authService: AuthService;
// constructor(authService: AuthService) {
//   this.authService = authService;
// }
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    sendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otpResponseObj = yield this.authService.sendOtp(req.body);
                res.json((0, helper_1.sendResponse)(otpResponseObj));
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
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifyOtpResponse = yield this.authService.verifyOtp(req.body);
                res.json((0, helper_1.sendResponse)(verifyOtpResponse));
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
}
exports.AuthController = AuthController;
