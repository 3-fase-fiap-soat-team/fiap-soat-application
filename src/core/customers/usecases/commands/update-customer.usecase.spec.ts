import { UpdateCustomerUseCase } from './update-customer.usecase';

describe('UpdateCustomerUseCase', () => {
  it('throws when customer not found', async () => {
    const gateway: any = { findById: jest.fn().mockResolvedValue(null) };
    await expect(UpdateCustomerUseCase.execute({ id: 'x' } as any, gateway)).rejects.toThrow('Customer not found');
  });

  it('throws when cpf conflicts with another customer', async () => {
    const existing = { id: 'a', cpf: '111', updateName: jest.fn(), updateEmail: jest.fn(), updateCpf: jest.fn() } as any;
    const gateway: any = { findById: jest.fn().mockResolvedValue(existing), findByCpf: jest.fn().mockResolvedValue({ id: 'b' }) };

    await expect(UpdateCustomerUseCase.execute({ id: 'a', cpf: '222' } as any, gateway)).rejects.toThrow('Customer with this CPF already exists');
  });

  it('updates fields and saves', async () => {
    const existing = { id: 'a', cpf: '111', updateName: jest.fn(), updateEmail: jest.fn(), updateCpf: jest.fn() } as any;
    const gateway: any = { findById: jest.fn().mockResolvedValue(existing), findByCpf: jest.fn().mockResolvedValue(null), save: jest.fn().mockResolvedValue(existing) };

    const res = await UpdateCustomerUseCase.execute({ id: 'a', name: 'New', email: 'e', cpf: '111' } as any, gateway);
    expect(existing.updateName).toHaveBeenCalledWith('New');
    expect(existing.updateEmail).toHaveBeenCalledWith('e');
    expect(gateway.save).toHaveBeenCalledWith(existing);
    expect(res).toBe(existing);
  });
});
