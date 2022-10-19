import { Router } from "express";
import {celebrate, Joi, Segments} from 'celebrate';
import OrdersController from "../controllers/OrdersController";

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.get("/:id", 
celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required()
  }
})
);

ordersRouter.post("/",
celebrate({
  [Segments.PARAMS]: {
  customer_id: Joi.string().uuid().required(),
  products: Joi.required()
}
}),
ordersController.create);


export default ordersRouter;
