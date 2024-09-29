import { RowDataPacket } from "mysql2";
import connection from "../config/db";
import { Request, Response } from "express";
import { Profile } from "../interfaces/profile";

export const ProfileAttendance = async (req: Request, res: Response) => {
    const { nik } = req.body;
    try {
        const [row] = await connection.query<RowDataPacket[]>(
            `SELECT 
                ID_KAR as nik,
                NM_LKP as nama,
                GENDER as gender,
                ALAMAT as alamat,
                TELP as nohp,
                TG_LHR as tgl_lahir,
                TG_MASUK as tgl_masuk,
                ST_KERJA as st_kerja,
                JABATAN as jabatan,
                PENDIDIKAN as pendidikan,
                ST_MARITAL as status,
                BAGIAN as divisi,
                no_rek
            FROM dt_karyawan 
            WHERE ID_KAR = ?`, [nik]
        );
        const data = row[0] as Profile;

        const [rowEmail] = await connection.query<RowDataPacket[]>(
            `SELECT email
            FROM user_auth
            WHERE nik = ?`, [nik]
        );
        const email = rowEmail[0].email as string;

        return res.status(200).json({ 
            data: {
                ...data,
                email
            } 
        });
        
    } catch (error) {
        return res.status(500).json({ message: 'Terjadi kesalahan pada server.' })
    }
}