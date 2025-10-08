export class ProductStock {
    constructor(
        public readonly value: number,
    ) {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error('O estoque deve ser um número inteiro positivo.');
        }
    }
    
    equals(stock: ProductStock): boolean {
        return stock instanceof ProductStock && this.value === stock.value;
    }

    increase(quantity: number): ProductStock {
        if (quantity < 0) {
            throw new Error('A quantidade para adicionar deve ser positiva.');
        }
        return new ProductStock(this.value + quantity);
    }

    decrease(quantity: number): ProductStock {
        if (quantity < 0) {
            throw new Error('A quantidade para remover deve ser positiva.');
        }
        if (this.value < quantity) {
            throw new Error('A quantidade para remover é maior que a quantidade em estoque.');
        }
        return new ProductStock(this.value - quantity);
    }
}