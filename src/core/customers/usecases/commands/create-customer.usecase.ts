import { Customer } from '../../entities/customer';
import { CustomersGateway } from '../../operation/gateways/customers-gateway';
import { CustomerFactory } from '../../entities/factories/customer.factory';

export interface CreateCustomerDTO {
  name: string;
  email: string;
  cpf: string;
}

export class CreateCustomerUseCase {
  static async execute(
    createCustomerDto: CreateCustomerDTO,
    customerGateway: CustomersGateway,
  ): Promise<Customer> {
    
    // Verificar se já existe cliente com o mesmo CPF
    const existingCustomer = await customerGateway.findByCpf(createCustomerDto.cpf);
    if (existingCustomer) {
      throw new Error('Customer with this CPF already exists');
    }

    // Criar novo cliente usando factory
    const factory = new CustomerFactory();
    const newCustomer = factory.create(
      createCustomerDto.name,
      createCustomerDto.email,
      createCustomerDto.cpf
    );

    // Salvar cliente
    return await customerGateway.save(newCustomer);
  }
}
