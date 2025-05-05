"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = ({ status, data, message, code }) => {
    return {
        success: status,
        code: code,
        data,
        message,
    };
};
exports.sendResponse = sendResponse;
