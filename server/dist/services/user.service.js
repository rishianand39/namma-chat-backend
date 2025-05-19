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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const constant_1 = require("../constant");
dotenv_1.default.config();
class UserService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    getUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.prisma.user.findFirst({
                where: { id: user_id },
            });
            return {
                id: user === null || user === void 0 ? void 0 : user.id,
                name: user === null || user === void 0 ? void 0 : user.name,
                phone: user === null || user === void 0 ? void 0 : user.phone,
                email: user === null || user === void 0 ? void 0 : user.email,
                profile_image: user === null || user === void 0 ? void 0 : user.profile_image,
                about: user === null || user === void 0 ? void 0 : user.about,
                created_at: user === null || user === void 0 ? void 0 : user.created_at,
                updated_at: user === null || user === void 0 ? void 0 : user.updated_at,
                is_online: user === null || user === void 0 ? void 0 : user.is_online,
                last_seen: user === null || user === void 0 ? void 0 : user.last_seen,
            };
        });
    }
    updateUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ user_id, data }) {
            const user = yield this.prisma.user.update({
                where: { id: user_id },
                data,
            });
            return {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                profile_image: user.profile_image,
                about: user.about,
                created_at: user.created_at,
                updated_at: user.updated_at,
                is_online: user.is_online,
                last_seen: user.last_seen,
            };
        });
    }
    deleteUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ user_id }) {
            yield this.prisma.user.delete({
                where: { id: user_id },
            });
            return {
                message: "User deleted successfully",
            };
        });
    }
    importContacts(user_id, phone_numbers) {
        return __awaiter(this, void 0, void 0, function* () {
            const registeredUsers = yield this.prisma.user.findMany({
                where: {
                    phone: {
                        in: phone_numbers,
                    },
                },
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    profile_image: true,
                    created_at: true,
                    updated_at: true,
                    is_online: true,
                    last_seen: true,
                },
            });
            const registeredPhones = registeredUsers.map(u => u.phone);
            const baseUrl = process.env.APP_INVITE_URL;
            const registeredContacts = registeredUsers.map(user => ({
                id: user.id,
                name: user.name,
                phone: user.phone,
                profile_image: user.profile_image,
                is_registered: true,
                created_at: user.created_at,
                updated_at: user === null || user === void 0 ? void 0 : user.updated_at,
            }));
            const unregisteredContacts = phone_numbers
                .filter(phone => !registeredPhones.includes(phone))
                .map(phone => ({
                id: null,
                name: null,
                phone: phone,
                profile_image: null,
                is_registered: false,
                invite_link: `${baseUrl}?phone=${phone}`,
            }));
            const allContacts = [...registeredContacts, ...unregisteredContacts];
            yield this.prisma.contactList.create({
                data: {
                    owner_id: user_id,
                    contacts: allContacts
                }
            });
            return allContacts;
        });
    }
    getContacts(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const contactList = yield this.prisma.contactList.findFirst({
                where: {
                    owner_id: user_id
                },
                select: {
                    id: true,
                    contacts: true,
                    updated_at: true
                },
            });
            if (!contactList)
                return [];
            const { updated_at } = contactList, rest = __rest(contactList, ["updated_at"]);
            return Object.assign(Object.assign({}, rest), { last_synced_at: updated_at });
        });
    }
    syncContacts(user_id, newContacts) {
        return __awaiter(this, void 0, void 0, function* () {
            const registeredUsers = yield this.prisma.user.findMany({
                where: {
                    phone: {
                        in: newContacts,
                    },
                },
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    profile_image: true,
                    created_at: true,
                    updated_at: true,
                    is_online: true,
                    last_seen: true,
                },
            });
            const registeredPhones = registeredUsers.map(u => u.phone);
            const baseUrl = process.env.APP_INVITE_URL;
            const registeredContacts = registeredUsers.map(user => ({
                id: user.id,
                name: user.name,
                phone: user.phone,
                profile_image: user.profile_image,
                is_registered: true,
                created_at: user.created_at,
                updated_at: user === null || user === void 0 ? void 0 : user.updated_at,
            }));
            const unregisteredContacts = newContacts
                .filter(phone => !registeredPhones.includes(phone))
                .map(phone => ({
                id: null,
                name: null,
                phone: phone,
                profile_image: null,
                is_registered: false,
                invite_link: `${baseUrl}?phone=${phone}`,
            }));
            const allContacts = [...registeredContacts, ...unregisteredContacts];
            try {
                yield this.prisma.contactList.update({
                    where: {
                        owner_id: user_id
                    },
                    data: {
                        contacts: allContacts
                    }
                });
                return {
                    status: true,
                    code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SUCCESS,
                    message: 'Contacts synced successfully'
                };
            }
            catch (error) {
                return {
                    status: false,
                    code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SERVER_ERROR,
                    message: error.message,
                };
            }
        });
    }
}
exports.UserService = UserService;
