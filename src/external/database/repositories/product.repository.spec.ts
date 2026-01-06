import { Repository } from 'typeorm';
import { OrmProductRepository } from './product.repository';
import { ProductEntity } from '../entities/product.entity';
import { Product } from 'src/core/products/entities/product';
import { ProductStock } from 'src/core/products/entities/value-objects/product-stock';

describe('OrmProductRepository', () => {
  let mockRepository: Partial<Repository<ProductEntity>>;
  let ormProductRepository: OrmProductRepository;

  const now = new Date();
  const sampleEntity: ProductEntity = {
    id: 'prod-1',
    name: 'Product 1',
    description: 'Desc',
    price: 10.5 as any,
    category_id: 'cat-1',
    stock: 5,
    image: null,
    createdAt: now,
    updatedAt: now,
  };

  const sampleDomain = new Product(
    'prod-1',
    'Product 1',
    'Desc',
    10.5,
    'cat-1',
    new ProductStock(5),
    '',
    now,
    now,
  );

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    ormProductRepository = new OrmProductRepository(
      mockRepository as unknown as Repository<ProductEntity>,
    );
  });

  it('should save a product and return domain object', async () => {
    (mockRepository.save as jest.Mock).mockResolvedValue(sampleEntity);

    const result = await ormProductRepository.save(sampleDomain);

    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Product);
    expect(result.id).toBe(sampleDomain.id);
    expect(result.name).toBe(sampleDomain.name);
  });

  it('should find all products', async () => {
    (mockRepository.find as jest.Mock).mockResolvedValue([sampleEntity]);

    const result = await ormProductRepository.findAll();

    expect(mockRepository.find).toHaveBeenCalled();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBeInstanceOf(Product);
  });

  it('should find product by id and return domain', async () => {
    (mockRepository.findOne as jest.Mock).mockResolvedValue(sampleEntity);

    const result = await ormProductRepository.findById('prod-1');

    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'prod-1' } });
    expect(result).toBeInstanceOf(Product);
  });

  it('should return null when product not found', async () => {
    (mockRepository.findOne as jest.Mock).mockResolvedValue(undefined);

    const result = await ormProductRepository.findById('not-found');

    expect(result).toBeNull();
  });

  it('should find products by category', async () => {
    (mockRepository.find as jest.Mock).mockResolvedValue([sampleEntity]);

    const result = await ormProductRepository.findByCategory('cat-1');

    expect(mockRepository.find).toHaveBeenCalledWith({ where: { category_id: 'cat-1' } });
    expect(result[0]).toBeInstanceOf(Product);
  });

  it('should delete product', async () => {
    (mockRepository.delete as jest.Mock).mockResolvedValue(undefined);

    await ormProductRepository.delete('prod-1');

    expect(mockRepository.delete).toHaveBeenCalledWith('prod-1');
  });

  it('should find many by ids', async () => {
    (mockRepository.find as jest.Mock).mockResolvedValue([sampleEntity]);

    const result = await ormProductRepository.findManyByIds(['prod-1']);

    expect(mockRepository.find).toHaveBeenCalled();
    expect(result[0]).toBeInstanceOf(Product);
  });

  it('should update product using save', async () => {
    (mockRepository.save as jest.Mock).mockResolvedValue(sampleEntity);

    await ormProductRepository.update(sampleDomain);

    expect(mockRepository.save).toHaveBeenCalled();
  });
});
