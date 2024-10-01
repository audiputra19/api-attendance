import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import attendanceRoutes from './routes/attendanceRoutes';
import authRouter from './routes/authRoutes';
import forgotPassRouter from './routes/forgotPassRoutes';
import leaveRouter from './routes/leaveRoutes';
import profileRouter from './routes/profileRoutes';
import reportRouter from './routes/reportRoutes';
dotenv.config();

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

//end point untuk leave
app.use('/', leaveRouter);

app.get('/', (req: Request, res: Response) => {
    res.send("welcome");
})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})