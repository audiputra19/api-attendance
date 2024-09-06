import express from 'express'
import { ReportAttendance } from '../controllers/reportController';

const reportRouter = express.Router();

reportRouter.post('/main', ReportAttendance);

export default reportRouter;