import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import multer from "multer";
import uploadConfig from "@config/upload";
import UsersController from "../controllers/UsersController";
import isAthenticated from "../../../shared/http/middlewares/isAuthenticated";
import UserAvatarController from "../controllers/UserAvatarController";

const usersRouter = Router();
const userController = new UsersController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig);

usersRouter.get('/', isAthenticated, userController.index);

usersRouter.post('/', celebrate({
  [Segments.BODY]:{
    name:Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }
}), userController.create);

usersRouter.patch('/avatar', isAthenticated, upload.single('avatar'), userAvatarController.update)

export default usersRouter;
