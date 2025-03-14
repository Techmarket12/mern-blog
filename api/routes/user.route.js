import express from 'express';
import {updateUser, deleteUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/Verifyuser.js';

const UserRouter = express.Router();

UserRouter.put('/update/:userId', verifyToken, updateUser);
UserRouter.delete('/delete/:userId', verifyToken, deleteUser);

export default UserRouter;