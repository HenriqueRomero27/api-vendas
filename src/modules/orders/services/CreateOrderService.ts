import CustomerRepository from "@modules/costumers/typeorm/repositories/CustomerRepository";
import { ProductRepository } from "@modules/products/typeorm/repositories/ProductsRepository";
import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm"
import Order from "../typeorm/entities/Order";
import OrderRepository from "../typeorm/repositories/OrdersRepository";

interface IProducts {
    id: string,
    quantity: number
}

interface IRequest {
  customer_id:string,
  products: IProducts[]
}

class CreateOrderService {
  public async execute({customer_id, products}: IRequest):Promise<Order> {
    const ordersRepository = getCustomRepository(OrderRepository);
    const customerRepository = getCustomRepository(CustomerRepository);
    const productsRepository = getCustomRepository(ProductRepository);
    
    const customerExists = await customerRepository.findById(customer_id);

    if(!customerExists) {
      throw new AppError("Could not find any customer with the given id.");

    }

    const existsProduct = await productsRepository.findAllByIds(products);

    if(!existsProduct.length) {
        throw new AppError("Could not find any products with the given ids.");
    }

    const existsProductsIds = existsProduct.map((product) => product.id);

    const checkInexistentProducts = products.filter(
        product => !existsProductsIds.includes(product.id),
    );
    
    if(checkInexistentProducts.length) {
        throw new AppError(`Could not find product ${checkInexistentProducts[0]}`)
    }

    const quantityAvailable = products.filter(
        product => existsProduct.filter(
            p => p.id === product.id)[0].quantity < product.quantity
        );

    if(quantityAvailable.length) {
        throw new AppError(`The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}.`);
    }

    const serializedProducts = products.map(product => ({
        product_id: product.id,
        quantity: product.quantity,
        price: existsProduct.filter(p => p.id === product.id)[0].price
    }));

    const order = await ordersRepository.createOrder({
        customer: customerExists,
        products: serializedProducts
    });

    const {order_products} = order;

    const updatedProductQuantity = order_products.map(
        product => ({
            id: product.product_id,
            quantity: existsProduct.filter(p => p.id === product.product_id)[0].quantity - product.quantity
        })
    )

    await productsRepository.save(updatedProductQuantity)

    return order;
  }
}
export default CreateOrderService;
