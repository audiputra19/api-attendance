import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import connection from "../config/db";
import { RowDataPacket } from "mysql2";
import { TemporaryUser } from "../interfaces/verfication";

export const verficationRegistration = async (req: Request, res: Response) => {
    const { token } = req.body;

    try {
        const secret = process.env.JWT_SECRET!;
        const decoded = jwt.verify(token, secret);

        const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM temporary_users WHERE token = ?', [token]);
        const tempUser = rows[0] as TemporaryUser;

        if (!tempUser) {
            return res.status(404).json({ message: 'Token tidak valid atau sudah kedaluwarsa' });
        }

        await connection.query('INSERT INTO user_auth (nik, email, pass) VALUES (?, ?, ?)', [tempUser.nik, tempUser.email, tempUser.pass]);
        await connection.query('DELETE FROM user_temporary WHERE token = ?', [token]);

        return res.status(200).json({ message: 'Registrasi berhasil, silakan login' });

    } catch (error) {
        return res.status(500).json({ message: 'Token tidak valid atau sudah kedaluwarsa' });
    }
}