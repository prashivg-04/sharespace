import { Router } from 'express';
import { signup, login, verify } from '../controllers/authController.js';

const router = Router();

router.post('/signup', signup);
router.post('/register', signup); // alias for signup
router.post('/login', login);
router.get('/verify', verify);

export default router;

