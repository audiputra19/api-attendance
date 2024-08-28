import { Request, Response } from "express";
import connection from "../config/db";
import { RowDataPacket } from "mysql2";
import { User } from "../interfaces/user";
import bcrypt from 'bcryptjs';
import { generateTokenAuth } from "../utils/generateTokenAuth";

export const registerUser = async (req: Request, res: Response) => {
    const {nik, email, password, confirmPassword} = req.body;

    try {
        if(nik.length === 0 || email.length === 0 || password.length === 0 || confirmPassword.length === 0){
            return res.status(401).json({ message: 'Form harus diisi' });
        }

        const passwordRegex = /^.{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(404).json({ message: 'Password minimal 6 karakter.' });
        }

        if(password !== confirmPassword){
            return res.status(404).json({ message: 'Isi konfirmasi password dengan benar' })
        }

        const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM dt_karyawan WHERE dt_karyawan.ID_KAR = ?', [nik]);
        const user = rows as User[]; 

        if(user.length === 0){
            return res.status(404).json({ message: 'NIK tidak ditemukan'});
        }

        const [data] = await connection.query<RowDataPacket[]>('SELECT * FROM user_auth WHERE nik = ?', [nik]);
        const userAuth = data as User[];
        
        if(userAuth.length !== 0){
            return res.status(404).json({ message: 'NIK sudah pernah registrasi' })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        
        await connection.query('INSERT INTO user_auth (nik, pass, email) VALUE (?, ?, ?)', [nik, hashedPass, email]);

        return res.status(200).json({ message: 'Registrasi berhasil' })
    } catch (error) {
        return res.status(500).json({ message: 'Terjadi kesalahan pada server', error });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const {nik, password} = req.body;

    try {
        if(nik.length === 0 || password.length === 0){
            return res.status(401).json({ message: 'Form harus diisi' });
        }

        const [rows] = await connection.query('SELECT * FROM user_auth WHERE nik = ?', [nik]);
        const data = rows as User[];
        const user = data[0];


        if(user){
            const isPasswordMatch = await bcrypt.compare(password, user.pass);

            if(isPasswordMatch){
                const userData = {
                    nik: user.nik,
                    email: user.email,
                    pass: user.pass
                };

                const token = generateTokenAuth(userData);

                return res.status(200).json({
                    data: {
                        userData,
                        token,
                    }, 
                    message: 'Login berhasil',
                });
            } else {
                return res.status(401).json({ message: 'NIK atau password salah!' }); 
            }
        } else {
            return res.status(401).json({ message: 'NIK atau password salah!' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Terjadi kesalahan pada server', error });
    }
}