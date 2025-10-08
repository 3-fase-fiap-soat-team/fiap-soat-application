import { ApiProperty } from "@nestjs/swagger";

export class CustomerReadModel {
  @ApiProperty({
    description: 'Identificador único da cliente',
    example: '3f69217b-d5a0-4dd3-9005-719277ea325b',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da cliente',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Email da cliente',
    example: 'john_doe@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'CPF da cliente',
    example: '123.456.789-00',
  })
  cpf: string;
}
