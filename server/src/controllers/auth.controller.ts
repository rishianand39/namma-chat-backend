import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendResponse } from '../utils/helper';


// private authService: AuthService;

// constructor(authService: AuthService) {
//   this.authService = authService;
// }

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response) {
    try {
      const user = await this.authService.register(req.body);
      res.json(sendResponse({
        status: true,
        code: 200,
        data: user,
        message: 'User registered successfully',
      }));
    } catch (err: any) {
      res.json(sendResponse({
        status: false,
        code: 500,
        message: err.message,
      }))
    }
  }

  async login(req: Request, res: Response) {
    try {
      const token = await this.authService.login(req.body);
      res.json(sendResponse({
        status: true,
        code: 200,
        data: token,
        message: 'User logged in successfully',
      }));
    } catch (err: any) {
      res.json(sendResponse({
        status: false,
        code: 500,
        message: err.message,
      }));
    }
  }

  async sendOtp(req: Request, res: Response) {
    try {
      const otp = await this.authService.sendOtp(req.body);
      res.json(sendResponse({
        status: true,
        code: 200,
        data: {
          otp,
        },
        message: 'Otp sent successfully',
      }));
    } catch (err: any) {
      res.json(sendResponse({
        status: false,
        code: 500,
        message: err.message,
      }));
    }
  }
}
