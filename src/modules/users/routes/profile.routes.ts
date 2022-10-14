import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import isAthenticated from "../../../shared/http/middlewares/isAuthenticated";
import ProfileController from "../controllers/ProfileConrtoller";

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(isAthenticated);

profileRouter.get('/', profileController.show);

profileRouter.put('/', celebrate({
  [Segments.BODY]:{
    name:Joi.string().required(),
    email: Joi.string().email().required(),
    old_password: Joi.string(),
    password: Joi.string().optional(),
    password_comfirmation: Joi.string().valid(Joi.ref('password')).when('password',     {
        is: Joi.exist(),
        then: Joi.required()
    })
  }
}), profileController.update);

export default profileRouter;