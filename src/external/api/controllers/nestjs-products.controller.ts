import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  Query,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductDTO } from 'src/core/common/dtos/product.dto';
import { ProductController } from 'src/core/products/operation/controllers/product-controller';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductIdDTO } from 'src/core/common/dtos/product-id.dto';
import { IProductDataSource } from 'src/interfaces/product-datasource';
import { ICategoryDataSource } from 'src/interfaces/category-datasource';
import { IdGenerator } from 'src/interfaces/id-generator';

@Controller('products')
export class NestJSProductsController {
  constructor(
    private readonly productDataSource: IProductDataSource,
    private readonly categoryDataSource: ICategoryDataSource,
    private readonly idGenerator: IdGenerator,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retorna todos os produtos',
    type: [ProductDTO],
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'ID da categoria para filtrar produtos',
  })
  async findAll(@Query('categoryId') categoryId?: string) {
    try {
      if (categoryId) {
        return await ProductController.findByCategory(categoryId, this.productDataSource);
      }
      return await ProductController.findAll(this.productDataSource);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retorna o produto encontrado',
    type: ProductDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Produto não encontrado',
  })
  async findById(@Param('id') id: string) {
    try {
      const product = await ProductController.findById(id, this.productDataSource);
      
      if (!product) {
        throw new NotFoundException('Produto não encontrado');
      }
      
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Produto criado com sucesso',
    type: ProductIdDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Categoria não encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      return await ProductController.save(
        createProductDto,
        this.categoryDataSource,
        this.productDataSource,
        this.idGenerator
      );
    } catch (error) {
      if (error.message === 'Category not found') {
        throw new NotFoundException('Categoria não encontrada');
      }
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um produto' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Produto atualizado com sucesso',
    type: ProductDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Produto ou categoria não encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      return await ProductController.update(
        id,
        updateProductDto,
        this.categoryDataSource,
        this.productDataSource
      );
    } catch (error) {
      if (error.message === 'Product not found') {
        throw new NotFoundException('Produto não encontrado');
      }
      if (error.message === 'Category not found') {
        throw new NotFoundException('Categoria não encontrada');
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um produto' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Produto deletado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Produto não encontrado',
  })
  async remove(@Param('id') id: string) {
    try {
      await ProductController.delete(id, this.productDataSource);
    } catch (error) {
      if (error.message === 'Product not found') {
        throw new NotFoundException('Produto não encontrado');
      }
      throw new BadRequestException(error.message);
    }
  }
}
