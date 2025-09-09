import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCustomerDto {
    @ApiProperty({
    example: 'John Doe',
    })
    @IsString()
    name: string;

    @ApiProperty({
    example: 'john_doe@email.com',
    })
    @IsString()
    email: string;

    @ApiProperty({
    example: '123456789',
    })
    @IsString()
    cpf: string;

}