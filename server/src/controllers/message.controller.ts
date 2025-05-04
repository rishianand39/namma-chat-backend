import { Request, Response } from "express";
import { MessageService } from "../services/message.service";
import { sendResponse } from "../utils/helper";

export class MessageController {
  constructor(private messageService: MessageService) {}
  async getUnreadMessages(req: Request, res: Response) {
    try {
      const user_id = (req as any).user.user_id;
      const unreadMessages = await this.messageService.getUnreadMessages(user_id);
      res.json(
        sendResponse({
          status: true,
          code: 200,
          data: unreadMessages,
          message: "Unread messages fetched successfully",
        })
      );
    } catch (err: any) {
      res.json(
        sendResponse({
          status: false,
          code: 500,
          message: err.message,
        })
      );
    }
  }
}
