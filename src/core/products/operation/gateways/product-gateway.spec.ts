import { ProductGateway } from './product-gateway';
import { Product } from '../../entities/product';
import { ProductStock } from '../../entities/value-objects/product-stock';

describe('ProductGateway', () => {
  const mockDataSource: any = {
    save: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn(),
    findByCategory: jest.fn(),
    findManyByIds: jest.fn(),
  };

  const gateway = new ProductGateway(mockDataSource);

  const product = new Product('p1', 'n', 'd', 1, 'c1', new ProductStock(2), '', new Date(), new Date());

  it('should delegate save', async () => {
    (mockDataSource.save as jest.Mock).mockResolvedValue(product);
    const res = await gateway.save(product);
    expect(mockDataSource.save).toHaveBeenCalledWith(product);
    expect(res).toBe(product);
  });

  it('should delegate findAll', async () => {
    (mockDataSource.findAll as jest.Mock).mockResolvedValue([product]);
    const res = await gateway.findAll();
    expect(mockDataSource.findAll).toHaveBeenCalled();
    expect(res[0]).toBe(product);
  });

  it('should delegate findById and delete and category and manyByIds', async () => {
    (mockDataSource.findById as jest.Mock).mockResolvedValue(product);
    (mockDataSource.delete as jest.Mock).mockResolvedValue(undefined);
    (mockDataSource.findByCategory as jest.Mock).mockResolvedValue([product]);
    (mockDataSource.findManyByIds as jest.Mock).mockResolvedValue([product]);

    await expect(gateway.findById('p1')).resolves.toBe(product);
    await gateway.delete('p1');
    expect(mockDataSource.delete).toHaveBeenCalledWith('p1');
    const byCat = await gateway.findByCategory('c1');
    expect(byCat[0]).toBe(product);
    const many = await gateway.findManyByIds(['p1']);
    expect(many[0]).toBe(product);
  });
});
