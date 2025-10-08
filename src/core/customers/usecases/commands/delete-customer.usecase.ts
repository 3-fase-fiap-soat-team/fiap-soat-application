import { CustomersGateway } from '../../operation/gateways/customers-gateway';

export class DeleteCustomerUseCase {
  static async execute(
    id: string,
    customerGateway: CustomersGateway,
  ): Promise<void> {
    
    // Verificar se o cliente existe
    const existingCustomer = await customerGateway.findById(id);
    if (!existingCustomer) {
      throw new Error('Customer not found');
    }

    // Deletar cliente
    await customerGateway.delete(id);
  }
}
