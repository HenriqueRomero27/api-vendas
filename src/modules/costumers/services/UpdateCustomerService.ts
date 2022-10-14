import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import { compare,hash } from 'bcryptjs';
import Customer from "../typeorm/entities/Custumer";
import CustomerRepository from "../typeorm/repositories/CustomerRepository";


interface IRequest {
  id: string,
  name: string,
  email: string,
}

const hashSalt = 8;//NÃO MUDAR

class UpdateCustomerService {
  public async execute({
    id,
    name,
    email
  }: IRequest):Promise<Customer> {
        const customersRepository = getCustomRepository(CustomerRepository);

        const customer = await customersRepository.findById(id);

        if(!customer) {
        throw new AppError("Customer not found");
        }

        const customerExists = await customersRepository.findByEmail(email);

        if(customerExists && email !== customer.email) {
        throw new AppError("This email is already used for another customer.");
        }

    customer.name = name;
    customer.email = email;

    await customersRepository.save(customer);

    return customer;
  }
}
export default UpdateCustomerService;
