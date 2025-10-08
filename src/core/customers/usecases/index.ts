// Commands
export { CreateCustomerUseCase, CreateCustomerDTO } from './commands/create-customer.usecase';
export { UpdateCustomerUseCase, UpdateCustomerDTO } from './commands/update-customer.usecase';
export { DeleteCustomerUseCase } from './commands/delete-customer.usecase';

// Queries
export { GetAllCustomersQuery } from './queries/get-all-customers.query';
export { GetCustomerByCpfQuery } from './queries/get-customer-by-cpf.query';
export { GetCustomerByIdQuery } from './queries/get-customer-by-id.query';
