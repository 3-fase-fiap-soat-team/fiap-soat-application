import { ICustomerDataSource } from "src/interfaces/customer-datasource";
import { CustomersGateway } from "../gateways/customers-gateway";
import { CustomersPresenter } from "../presenters/customers-presenter";
import { GetCustomerPresenter } from "../presenters/get-customer-presenter";
import { CustomerIdPresenter } from "../presenters/customer-id-presenter";

// CQRS Imports
import { CreateCustomerUseCase, CreateCustomerDTO } from "../../usecases/commands/create-customer.usecase";
import { GetAllCustomersQuery } from "../../usecases/queries/get-all-customers.query";
import { GetCustomerByCpfQuery } from "../../usecases/queries/get-customer-by-cpf.query";

export class CustomersController {
    static async findAll(dataSource: ICustomerDataSource) {
        const customersGateway = new CustomersGateway(dataSource);

        const customers = await GetAllCustomersQuery.execute(customersGateway);

        return CustomersPresenter.toDTO(customers);
    }

    static async findByCpf(cpf: string, dataSource: ICustomerDataSource) {
        const customersGateway = new CustomersGateway(dataSource);

        const customer = await GetCustomerByCpfQuery.execute(cpf, customersGateway);

        if (!customer) {
            throw new Error('Customer not found');
        }

        return GetCustomerPresenter.toDTO(customer);
    }

    static async save(customer: CreateCustomerDTO, dataSource: ICustomerDataSource) {
        const customerGateway = new CustomersGateway(dataSource);

        const customerSaved = await CreateCustomerUseCase.execute(customer, customerGateway);

        return CustomerIdPresenter.toDTO(customerSaved);
    }
}