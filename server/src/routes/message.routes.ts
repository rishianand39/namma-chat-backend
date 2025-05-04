import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { MessageController } from '../controllers/message.controller';
import { MessageService } from '../services/message.service';

const router = Router();
const controller = new MessageController(new MessageService());

router.get("/unread", authenticate, controller.getUnreadMessages.bind(controller));

export default router;
