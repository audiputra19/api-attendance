import express from 'express'
import { ReportAttendance } from '../controllers/reportCOntroller';

const reportRouter = express.Router();

reportRouter.post('/main', ReportAttendance);

export default reportRouter;