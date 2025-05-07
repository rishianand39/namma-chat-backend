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
exports.MessageController = void 0;
const helper_1 = require("../utils/helper");
class MessageController {
    constructor(messageService) {
        this.messageService = messageService;
    }
    getUnreadMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = req.user.user_id;
                const unreadMessages = yield this.messageService.getUnreadMessages(user_id);
                res.json((0, helper_1.sendResponse)({
                    status: true,
                    code: 200,
                    data: unreadMessages,
                    message: "Unread messages fetched successfully",
                }));
            }
            catch (err) {
                res.json((0, helper_1.sendResponse)({
                    status: false,
                    code: 500,
                    message: err.message,
                }));
            }
        });
    }
}
exports.MessageController = MessageController;
