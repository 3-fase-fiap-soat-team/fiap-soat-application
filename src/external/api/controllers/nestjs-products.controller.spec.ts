import { NestJSProductsController } from './nestjs-products.controller';
import { ProductController } from 'src/core/products/operation/controllers/product-controller';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('NestJSProductsController', () => {
  const mockProductDataSource: any = {};
  const mockCategoryDataSource: any = {};
  const mockIdGenerator: any = { generate: jest.fn().mockReturnValue('gen-id') };

  let controller: NestJSProductsController;

  beforeEach(() => {
    controller = new NestJSProductsController(mockProductDataSource, mockCategoryDataSource, mockIdGenerator);
    jest.restoreAllMocks();
  });

  it('should call findAll when no categoryId', async () => {
    jest.spyOn(ProductController, 'findAll').mockResolvedValue([{ id: 'p1' } as any]);

    const res = await controller.findAll();

    expect(ProductController.findAll).toHaveBeenCalled();
    expect(res[0].id).toBe('p1');
  });

  it('should call findByCategory when categoryId provided', async () => {
    jest.spyOn(ProductController, 'findByCategory').mockResolvedValue([{ id: 'p2' } as any]);

    const res = await controller.findAll('cat-1');

    expect(ProductController.findByCategory).toHaveBeenCalledWith('cat-1', mockProductDataSource);
    expect(res[0].id).toBe('p2');
  });

  it('should return product by id or throw NotFound', async () => {
    jest.spyOn(ProductController, 'findById').mockResolvedValue({ id: 'p3' } as any);

    const res = await controller.findById('p3');
    expect(res.id).toBe('p3');

    jest.spyOn(ProductController, 'findById').mockResolvedValue(null as any);
    await expect(controller.findById('missing')).rejects.toThrow(NotFoundException);
  });

  it('should create a product and handle Category not found', async () => {
    jest.spyOn(ProductController, 'save').mockResolvedValue({ id: 'new' } as any);

    const res = await controller.create({} as any);
    expect(res.id).toBe('new');

    jest.spyOn(ProductController, 'save').mockRejectedValue(new Error('Category not found'));
    await expect(controller.create({} as any)).rejects.toThrow(NotFoundException);
  });

  it('should update and handle not found', async () => {
    jest.spyOn(ProductController, 'update').mockResolvedValue({ id: 'u1' } as any);

    const res = await controller.update('id', {} as any);
    expect(res.id).toBe('u1');

    jest.spyOn(ProductController, 'update').mockRejectedValue(new Error('Product not found'));
    await expect(controller.update('id', {} as any)).rejects.toThrow(NotFoundException);
  });

  it('should remove and handle not found', async () => {
    jest.spyOn(ProductController, 'delete').mockResolvedValue(undefined);

    await expect(controller.remove('id')).resolves.toBeUndefined();

    jest.spyOn(ProductController, 'delete').mockRejectedValue(new Error('Product not found'));
    await expect(controller.remove('id')).rejects.toThrow(NotFoundException);
  });
});
