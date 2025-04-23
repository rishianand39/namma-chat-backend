// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';

const router = Router();
const controller = new AuthController(new AuthService());

router.post('/register', controller.register.bind(controller));
router.post('/login', controller.login.bind(controller));
router.post('/send-otp', controller.sendOtp.bind(controller))

export default router;
