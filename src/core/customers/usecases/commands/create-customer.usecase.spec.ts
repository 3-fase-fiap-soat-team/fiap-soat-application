import { CreateCustomerUseCase } from './create-customer.usecase';

describe('CreateCustomerUseCase', () => {
  it('creates a customer when cpf is unique', async () => {
    const gateway: any = {
      findByCpf: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue({ id: 'c1' }),
    };

    const dto = { name: 'n', email: 'e', cpf: '111' } as any;
    const res = await CreateCustomerUseCase.execute(dto, gateway);
    expect(gateway.findByCpf).toHaveBeenCalledWith('111');
    expect(gateway.save).toHaveBeenCalled();
    expect(res).toEqual({ id: 'c1' });
  });

  it('throws when cpf already exists', async () => {
    const gateway: any = {
      findByCpf: jest.fn().mockResolvedValue({ id: 'c2' }),
    };

    await expect(CreateCustomerUseCase.execute({ name: 'n', email: 'e', cpf: '111' } as any, gateway)).rejects.toThrow('Customer with this CPF already exists');
  });
});
