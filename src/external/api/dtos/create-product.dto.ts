import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'X-Burger',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Hamburger com queijo, bacon e cebola',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 19.99,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 'b477f4bc-373a-4e8a-ac71-11523b821a0e',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'O ID da categoria é obrigatório' })
  categoryId: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    example: 50,
  })
  stock: number;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  image: string;

}