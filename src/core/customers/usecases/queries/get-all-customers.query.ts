import { Customer } from '../../entities/customer';
import { CustomersGateway } from '../../operation/gateways/customers-gateway';

export class GetAllCustomersQuery {
  static async execute(
    customerGateway: CustomersGateway,
  ): Promise<Customer[]> {
    return await customerGateway.findAll();
  }
}
