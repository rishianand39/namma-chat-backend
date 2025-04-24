import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendResponse } from '../utils/helper';


// private authService: AuthService;

// constructor(authService: AuthService) {
//   this.authService = authService;
// }

export class AuthController {
  constructor(private authService: AuthService) {}

  async sendOtp(req: Request, res: Response) {
    try {
      const otpResponseObj = await this.authService.sendOtp(req.body);
      res.json(sendResponse(otpResponseObj));
    } catch (err: any) {
      res.json(sendResponse({
        status: false,
        code: 500,
        message: err.message,
      }));
    }
  }

  async verifyOtp(req: Request, res: Response) {
    try {
      const verifyOtpResponse = await this.authService.verifyOtp(req.body);
      res.json(sendResponse(verifyOtpResponse));
    } catch (err: any) {
      res.json(sendResponse({
        status: false,
        code: 500,
        message: err.message,
      }));
    }
  }
}
