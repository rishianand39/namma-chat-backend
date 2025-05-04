import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';

const router = Router();
const controller = new UserController(new UserService());

router.get('/', authenticate, controller.getUser.bind(controller))
router.patch('/update', authenticate, controller.updateUser.bind(controller))
router.delete('/delete', authenticate, controller.deleteUser.bind(controller))
router.post('/import-contacts', authenticate, controller.importContacts.bind(controller))


export default router;
