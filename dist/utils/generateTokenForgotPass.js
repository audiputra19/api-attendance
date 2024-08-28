"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenForgotPass = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTokenForgotPass = (id) => {
    const secret = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign({ id }, secret, {
        expiresIn: '1h'
    });
};
exports.generateTokenForgotPass = generateTokenForgotPass;
