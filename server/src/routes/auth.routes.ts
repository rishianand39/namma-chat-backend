import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';

const router = Router();
const controller = new AuthController(new AuthService());

router.post('/send-otp', controller.sendOtp.bind(controller))
router.post('/verify-otp', controller.verifyOtp.bind(controller))

export default router;
