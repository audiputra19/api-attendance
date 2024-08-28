import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express'
import attendanceRoutes from './routes/attendanceRoutes';
import cors from 'cors';
import authRouter from './routes/authRoutes';
import forgotPassRouter from './routes/forgotPassRoutes';


const app = express();  

app.use(cors({
    origin: 'https:/api.karixa.co.id',
}))

app.use(express.json());
 
//end point untuk menjalankan absensi
app.use('/', attendanceRoutes);

//end point untuk menjalankan authentication
app.use('/auth', authRouter);

//end point untuk menjalankan lupa password
app.use('/auth', forgotPassRouter);

app.get('/', (req: Request, res: Response) => {
    res.send("welcome");
})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})