import { Injectable } from '@nestjs/common';
import { ProductMapper } from '../mappers/product.mapper';
import { ProductEntity } from '../entities/product.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IProductDataSource } from 'src/interfaces/product-datasource';
import { Product } from 'src/core/products/entities/product';

@Injectable()
export class OrmProductRepository implements IProductDataSource {
  constructor(
    @InjectRepository(ProductEntity)
  private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async save(product: Product): Promise<Product> {
    const productEntity = ProductMapper.toPersistence(product);
    const newEntity = await this.productRepository.save(productEntity);
    return ProductMapper.toDomain(newEntity);
  }

  async findAll(): Promise<Product[]> {
    const entities = await this.productRepository.find();
    return entities.map(ProductMapper.toDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.productRepository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }
    return ProductMapper.toDomain(entity);
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const entities = await this.productRepository.find({ 
      where: { category_id: categoryId } 
    });
    return entities.map(ProductMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }

  async findManyByIds(ids: string[]): Promise<Product[]> {
    const entities = await this.productRepository.find({ where: { id: In(ids) } });
    return entities.map(ProductMapper.toDomain);
  }

  async update(product: Product): Promise<void> {
    const productEntity = ProductMapper.toPersistence(product);
    await this.productRepository.save(productEntity);
  }
}
