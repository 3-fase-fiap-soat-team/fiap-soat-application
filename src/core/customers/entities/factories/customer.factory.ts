import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Customer } from '../customer';

@Injectable()
export class CustomerFactory {
  create(
    name: string,
    email: string,
    cpf: string
  ): Customer {
    const now = new Date();

    return new Customer(
      randomUUID(),
      name,
      email,
      cpf,
      now,
      now
    );
  }
  
}
