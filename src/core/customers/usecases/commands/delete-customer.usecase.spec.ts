import { DeleteCustomerUseCase } from './delete-customer.usecase';

describe('DeleteCustomerUseCase', () => {
  it('throws when not found', async () => {
    const gateway: any = { findById: jest.fn().mockResolvedValue(null) };
    await expect(DeleteCustomerUseCase.execute('x', gateway)).rejects.toThrow('Customer not found');
  });

  it('deletes when exists', async () => {
    const gateway: any = { findById: jest.fn().mockResolvedValue({ id: 'a' }), delete: jest.fn().mockResolvedValue(undefined) };
    await expect(DeleteCustomerUseCase.execute('a', gateway)).resolves.toBeUndefined();
    expect(gateway.delete).toHaveBeenCalledWith('a');
  });
});
