import express from 'express'
import { LeaveAttendance } from '../controllers/leaveController';

const leaveRouter = express.Router();

leaveRouter.post('/leave', LeaveAttendance);

export default leaveRouter;