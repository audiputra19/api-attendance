"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const connection = promise_1.default.createPool({
    host: 'sukabumi.karixa.co.id',
    user: 'nimda',
    password: 'B0r0k0k0K_',
    database: 'payroll_new'
});
connection.getConnection()
    .then(() => {
    console.log('Database connected successfully');
})
    .catch(err => {
    console.log('Datebase connection failed', err);
});
exports.default = connection;
