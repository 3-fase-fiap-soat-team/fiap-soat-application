import { Customer } from '../../entities/customer';
import { CustomersGateway } from '../../operation/gateways/customers-gateway';

export class GetCustomerByIdQuery {
  static async execute(
    id: string,
    customerGateway: CustomersGateway,
  ): Promise<Customer | null> {
    return await customerGateway.findById(id);
  }
}
