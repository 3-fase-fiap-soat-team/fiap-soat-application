import { Customer } from "src/core/customers/entities/customer";

export abstract class ICustomerDataSource {
    abstract save(customer: Customer): Promise<Customer>
    abstract findByCpf(cpf: string): Promise<Customer | null>
    abstract findById(id: string): Promise<Customer | null>
    abstract delete (id: string): Promise<void>
    abstract findAll(): Promise<Customer[]>
}