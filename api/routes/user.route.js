import express from 'express';
import { test } from '../controllers/user.controller.js';

const UserRouter = express.Router();

UserRouter.get('/', test);

export default UserRouter;