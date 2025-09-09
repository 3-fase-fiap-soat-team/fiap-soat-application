import { CustomerDTO } from "src/core/common/dtos/customer.dto";
import { Customer } from "../../entities/customer";

export class GetCustomerPresenter {
    static toDTO(customers: Customer): CustomerDTO {
        const customerDTO: CustomerDTO = { 
            id: customers.id,
            name: customers.name, 
            email: customers.email, 
            cpf: customers.cpf 
    };
        return customerDTO;
    }
}