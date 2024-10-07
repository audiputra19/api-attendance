import axios from "axios";
import { error } from "console";
import { NextFunction, Request, Response } from "express";

const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
) => {
    const R = 6371e3; // Radius bumi dalam meter
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Jarak dalam meter
}

export const distanceValidation = async (req: Request, res: Response, next: NextFunction) => {
    const {latitude, longitude} = req.body;
    const officeLocation = { latitude: -6.915196237927959, longitude: 106.8742431897525 };

    try {
        if(!latitude || !longitude){
            return res.status(400).json({ message: 'Koordinat salah!' })
        }

        // Dapatkan IP asli dari header X-Forwarded-For
        const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1';

        // Ambil hanya IP pertama jika ada beberapa IP di X-Forwarded-For
        const clientIp = ip.split(',')[0];
        console.log(clientIp)

        // Panggil API geolokasi berdasarkan IP pengguna
        const response = await axios.get(`https://ipapi.co/${clientIp}/json/`);
        const { latitude: ipLat, longitude: ipLon } = response.data;

        // Jika lokasi IP tidak ditemukan
        if (!ipLat || !ipLon) {
            return res.status(400).json({ message: 'Gagal mendapatkan lokasi dari IP.' });
        }

        // Hitung jarak antara lokasi IP dan koordinat absensi
        const ipDistance = calculateDistance(ipLat, ipLon, latitude, longitude);
        const sayIpDistance = Math.round(ipDistance);

        // Jika jarak antara IP dan lokasi absensi terlalu jauh
        if (ipDistance > 10000) { // Misalnya 10 km dianggap mencurigakan
            return res.status(400).json({ message: `Deteksi lokasi mencurigakan. Jarak lokasi IP anda ${sayIpDistance} meter dari lokasi absensi.` });
        }

        const distance = calculateDistance(
            officeLocation.latitude,
            officeLocation.longitude,
            latitude,
            longitude
        )
        
        const sayDistance = Math.round(distance);

        if(distance > 5){
            return res.status(400).json({ message: `Jarak anda ${sayDistance} meter` })
        } 

        next();
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
}