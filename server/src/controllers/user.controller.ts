import { Request, Response } from "express";
import { sendResponse } from "../utils/helper";
import { UserService } from "../services/user.service";
import { RESPONSE_CODE } from "../constant";

export class UserController {
  constructor(private authService: UserService) {}

  async getUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const user = await this.authService.getUser(userId);

      if (!user) {
        res.json(
          sendResponse({
            status: false,
            code: RESPONSE_CODE?.NOT_FOUND,
            message: "User not found",
          })
        );
      }

      res.json(
        sendResponse({
          status: true,
          code: RESPONSE_CODE?.SUCCESS,
          data: user,
        })
      );
    } catch (err: any) {
      res.json(
        sendResponse({
          status: false,
          code: RESPONSE_CODE?.SERVER_ERROR,
          message: err.message,
        })
      );
    }
  }
  async updateUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const data = req.body;
      const user = await this.authService.updateUser({ userId, data });

      if (!user) {
        res.json(
          sendResponse({
            status: false,
            code: RESPONSE_CODE?.NOT_FOUND,
            message: "User not found",
          })
        );
      }

      res.json(
        sendResponse({
          status: true,
          code: RESPONSE_CODE?.SUCCESS,
          data: user,
        })
      );
    } catch (err: any) {
      res.json(
        sendResponse({
          status: false,
          code: RESPONSE_CODE?.SERVER_ERROR,
          message: err.message,
        })
      );
    }
  }
  async deleteUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const user = await this.authService.deleteUser(userId);

      if (!user) {
        res.json(
          sendResponse({
            status: false,
            code: RESPONSE_CODE?.NOT_FOUND,
            message: "User not found",
          })
        );
      }

      res.json(
        sendResponse({
          status: true,
          code: RESPONSE_CODE?.SUCCESS,
          message: "User deleted successfully",
          data: user,
        })
      );
    } catch (err: any) {
      res.json(
        sendResponse({
          status: false,
          code: RESPONSE_CODE?.SERVER_ERROR,
          message: err.message,
        })
      );
    }
  }
}
