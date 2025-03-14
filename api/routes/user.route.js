import express from 'express';
import {updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/Verifyuser.js';

const UserRouter = express.Router();

UserRouter.put('/update/:userId', verifyToken, updateUser);

export default UserRouter;