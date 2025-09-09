import { Customer } from '../../entities/customer';
import { CustomersGateway } from '../../operation/gateways/customers-gateway';

export interface UpdateCustomerDTO {
  id: string;
  name?: string;
  email?: string;
  cpf?: string;
}

export class UpdateCustomerUseCase {
  static async execute(
    updateCustomerDto: UpdateCustomerDTO,
    customerGateway: CustomersGateway,
  ): Promise<Customer> {
    
    // Buscar cliente existente
    const existingCustomer = await customerGateway.findById(updateCustomerDto.id);
    if (!existingCustomer) {
      throw new Error('Customer not found');
    }

    // Se CPF foi alterado, verificar se já existe outro cliente com esse CPF
    if (updateCustomerDto.cpf && updateCustomerDto.cpf !== existingCustomer.cpf) {
      const customerWithSameCpf = await customerGateway.findByCpf(updateCustomerDto.cpf);
      if (customerWithSameCpf && customerWithSameCpf.id !== updateCustomerDto.id) {
        throw new Error('Customer with this CPF already exists');
      }
    }

    // Atualizar apenas os campos fornecidos usando os métodos da entidade
    if (updateCustomerDto.name !== undefined) {
      existingCustomer.updateName(updateCustomerDto.name);
    }
    if (updateCustomerDto.email !== undefined) {
      existingCustomer.updateEmail(updateCustomerDto.email);
    }
    if (updateCustomerDto.cpf !== undefined) {
      existingCustomer.updateCpf(updateCustomerDto.cpf);
    }

    // Salvar cliente atualizado
    return await customerGateway.save(existingCustomer);
  }
}
