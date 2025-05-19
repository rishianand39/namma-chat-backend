import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';

const router = Router();
const controller = new UserController(new UserService(), new MessageService());

router.get('/', authenticate, controller.getUser.bind(controller))
router.patch('/update', authenticate, controller.updateUser.bind(controller))
router.delete('/delete', authenticate, controller.deleteUser.bind(controller))
router.post('/import-contacts', authenticate, controller.importContacts.bind(controller))
router.get("/get-contacts", authenticate, controller.getContacts.bind(controller))
router.patch("/sync-contacts", authenticate, controller.syncContacts.bind(controller))
router.get("/chat-list", authenticate, controller.getChatList.bind(controller))


export default router;
