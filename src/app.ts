import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express'
import attendanceRoutes from './routes/attendanceRoutes';
import cors from 'cors';
import authRouter from './routes/authRoutes';
import forgotPassRouter from './routes/forgotPassRoutes';
import path from 'path';
import reportRouter from './routes/reportRoutes';
import profileRouter from './routes/profileRoutes';

const app = express();  

app.use(cors({
    origin: 'https://project-absensi.vercel.app',
    // origin: 'http://localhost:3000',
}));

app.use(express.json());
 
//end point untuk menjalankan absensi
app.use('/', attendanceRoutes);

//end point untuk menjalankan authentication
app.use('/auth', authRouter);

//end point untuk menjalankan lupa password
app.use('/auth', forgotPassRouter);

//end point untuk report
app.use('/report', reportRouter);

//end point untuk profile
app.use('/', profileRouter);

app.get('/', (req: Request, res: Response) => {
    res.send("welcome");
})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})