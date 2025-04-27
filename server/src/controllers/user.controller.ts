import { Request, Response } from "express";
import { sendResponse } from "../utils/helper";
import { UserService } from "../services/user.service";
import { RESPONSE_CODE } from "../constant";

export class UserController {
  constructor(private userService: UserService) {}

  async getUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user.user_id;
      const user = await this.userService.getUser(userId);

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
      const userId = (req as any).user.user_id;
      const data = req.body;
      const user = await this.userService.updateUser({ user_id : userId, data });

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
      const userId = (req as any).user.user_id;
      const user = await this.userService.deleteUser(userId);

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
  async importContacts(req: Request, res: Response) {
    try {
      const phoneNumbers = req.body.phone_numbers;
      const contacts = await this.userService.importContacts(phoneNumbers);

      res.json(
        sendResponse({
          status: true,
          code: RESPONSE_CODE?.SUCCESS,
          data: contacts,
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
