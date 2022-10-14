import { getCustomRepository } from "typeorm"
import Customer from "../typeorm/entities/Custumer";
import CustomerRepository from "../typeorm/repositories/CustomerRepository";


class ListCustomerService {
  public async execute():Promise<Customer[]> {
    const customerRepository = getCustomRepository(CustomerRepository);

    const customers = customerRepository.find();

    return customers;
  }
}
export default ListCustomerService;
