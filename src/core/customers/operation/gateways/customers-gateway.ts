import { ICustomerDataSource } from "src/interfaces/customer-datasource";
import { Customer } from "../../entities/customer";

export class CustomersGateway {
    datasource: ICustomerDataSource

    constructor(datasource: ICustomerDataSource) {
        this.datasource = datasource;
    }

    async findAll(): Promise<Customer[]> {
        return this.datasource.findAll();
    }

    async findByCpf(cpf: string): Promise<Customer | null> {
        return await this.datasource.findByCpf(cpf);
    }

    async findById(id: string): Promise<Customer | null> {
        return await this.datasource.findById(id);
    }

    async save(customer: Customer): Promise<Customer> {
        return await this.datasource.save(customer);
    }

    async delete(id: string): Promise<void> {
        return await this.datasource.delete(id);
    }
}