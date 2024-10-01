import { Request, Response } from "express";
import connection from "../config/db";
import { RowDataPacket } from "mysql2";
import moment from "moment-timezone";
import { Leave } from "../interfaces/leave";

export const LeaveAttendance = async (req: Request, res: Response) => {
    const { nik } = req.body;
    const lastYear = moment().tz('Asia/Jakarta').subtract(1, 'year').year();
    const date = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');
    const leaveDate = moment().tz('Asia/Jakarta').set({ 'month': 2, 'date': 1 }).format('YYYY-MM-DD');
    const lastLeaveDate = moment().tz('Asia/Jakarta').subtract(1, 'year').set({ 'month': 2, 'date': 1 }).format('YYYY-MM-DD');

    try {
        const [rowLeave] = await connection.query<RowDataPacket[]>(
            `SELECT SUM(cuti) as cuti
            FROM libur
            WHERE YEAR(tanggal) = ?
            AND cuti = '1'
            ORDER BY tanggal`, [lastYear]
        );

        const leave = rowLeave[0] as Leave;
        const leaveNow = 12 - leave.cuti;

        const [rowCheckLastLeave] = await connection.query<RowDataPacket[]>(
            `SELECT SUM(cuti) as cuti
            FROM absen_harian
            WHERE DATE(tanggal) BETWEEN ? AND ?
            AND nik = ?
            AND cuti = '1'
            ORDER BY tanggal`, [lastLeaveDate, leaveDate, nik]
        );

        const checkLastLeave = rowCheckLastLeave[0] as Leave;
        const lastLeaveCuti = checkLastLeave ? checkLastLeave.cuti : 0;

        let lastLeave = leaveNow - lastLeaveCuti;

        if (lastLeave < 0) {
            lastLeave = 0;
        }

        const [rowCheckLeaveNow] = await connection.query<RowDataPacket[]>(
            `SELECT SUM(cuti) as cuti
            FROM absen_harian
            WHERE DATE(tanggal) BETWEEN ? AND ?
            AND nik = ?
            AND cuti = '1'
            ORDER BY tanggal`, [leaveDate, date, nik]
        )

        const checkLeaveNow = rowCheckLeaveNow[0] as Leave;
        const leaveNowCuti = checkLeaveNow ? checkLeaveNow.cuti : 0;

        const myLeave = (leaveNow + lastLeave) - leaveNowCuti;

        return res.status(200).json({
            data: {
                massLeave: leave.cuti,
                annualLeave: leaveNow,
                lastLeave: lastLeave,
                myLeave: myLeave,
            }
        });
        
    } catch (error) {
        return res.status(500).json({ message: 'Terjadi kesalahan pada server' })
    }
}