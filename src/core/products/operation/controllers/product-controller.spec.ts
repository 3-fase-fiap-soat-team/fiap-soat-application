import { ProductController } from './product-controller';
import { IProductDataSource } from 'src/interfaces/product-datasource';
import { Product } from '../../entities/product';
import { ProductStock } from '../../entities/value-objects/product-stock';
import { ProductUseCase } from 'src/core/products/usecases/product-usecase';

describe('ProductController', () => {
  let mockDataSource: jest.Mocked<IProductDataSource>;

  const sampleProduct = new Product(
    'p-1',
    'Prod 1',
    'Desc',
    10.5,
    'cat-1',
    new ProductStock(5),
    'https://img',
    new Date(),
    new Date(),
  );

  beforeEach(() => {
    mockDataSource = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCategory: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IProductDataSource>;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('findAll should return presenter DTOs', async () => {
    mockDataSource.findAll.mockResolvedValue([sampleProduct]);

    const result = await ProductController.findAll(mockDataSource);

    expect(mockDataSource.findAll).toHaveBeenCalled();
    expect(result).toEqual([
      {
        id: 'p-1',
        name: 'Prod 1',
        description: 'Desc',
        price: 10.5,
        stock: 5,
        image: 'https://img',
      },
    ]);
  });

  it('findById should return single DTO when found', async () => {
    mockDataSource.findById.mockResolvedValue(sampleProduct);

    const result = await ProductController.findById('p-1', mockDataSource);

    expect(mockDataSource.findById).toHaveBeenCalledWith('p-1');
    expect(result).toEqual({
      id: 'p-1',
      name: 'Prod 1',
      description: 'Desc',
      price: 10.5,
      stock: 5,
      image: 'https://img',
    });
  });

  it('findById should return null when not found', async () => {
    mockDataSource.findById.mockResolvedValue(null as any);

    const result = await ProductController.findById('missing', mockDataSource);

    expect(result).toBeNull();
  });

  it('findByCategory should return DTOs', async () => {
    mockDataSource.findByCategory.mockResolvedValue([sampleProduct]);

    const result = await ProductController.findByCategory('cat-1', mockDataSource);

    expect(mockDataSource.findByCategory).toHaveBeenCalledWith('cat-1');
    expect(result.length).toBe(1);
  });

  it('save should call ProductUseCase.save and return id DTO', async () => {
    const spy = jest.spyOn(ProductUseCase, 'save').mockResolvedValue(sampleProduct);

    const newProd = {
      name: 'Prod',
      description: 'Desc',
      price: 1,
      categoryId: 'cat-1',
      stock: 1,
      image: 'img',
    };

    // note: ProductController.save constructs gateways/factories internally; we only ensure it returns ID DTO
    const result = await ProductController.save(newProd as any, {} as any, mockDataSource as any, {} as any);

    expect(spy).toHaveBeenCalled();
    expect(result).toEqual({ id: 'p-1' });
  });

  it('update should call ProductUseCase.update and return mapped DTO', async () => {
    const spy = jest.spyOn(ProductUseCase, 'update').mockResolvedValue(sampleProduct);

    const result = await ProductController.update('p-1', { name: 'x' } as any, {} as any, mockDataSource as any);

    expect(spy).toHaveBeenCalled();
    expect(result).toEqual({
      id: 'p-1',
      name: 'Prod 1',
      description: 'Desc',
      price: 10.5,
      stock: 5,
      image: 'https://img',
    });
  });

  it('delete should call ProductUseCase.delete', async () => {
    const spy = jest.spyOn(ProductUseCase, 'delete').mockResolvedValue();

    await ProductController.delete('p-1', mockDataSource as any);

    expect(spy).toHaveBeenCalledWith(expect.anything(), 'p-1');
  });
});
