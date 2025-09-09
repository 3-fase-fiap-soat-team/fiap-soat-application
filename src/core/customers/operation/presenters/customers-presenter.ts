import { CustomerDTO } from "src/core/common/dtos/customer.dto";
import { Customer } from "../../entities/customer";

export class CustomersPresenter {
    static toDTO(customers: Customer[]): CustomerDTO[] {
        if(customers) {
            const customersDTO: CustomerDTO[] = customers.map((customer) => ({
                id: customer.id,
                name: customer.name,
                email: customer.email,
                cpf: customer.cpf
            }))
            return customersDTO;
        } else {
            return [];
        }
    }
}