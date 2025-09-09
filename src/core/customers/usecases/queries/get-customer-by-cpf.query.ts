import { Customer } from '../../entities/customer';
import { CustomersGateway } from '../../operation/gateways/customers-gateway';

export class GetCustomerByCpfQuery {
  static async execute(
    cpf: string,
    customerGateway: CustomersGateway,
  ): Promise<Customer | null> {
    return await customerGateway.findByCpf(cpf);
  }
}
