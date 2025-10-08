import { Product } from './product';
import { ProductStock } from './value-objects/product-stock';

describe('Product Domain Entity', () => {
  const validProductData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    categoryId: 'category-123',
    stock: new ProductStock(10),
    image: 'https://example.com/image.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('constructor', () => {
    it('deve criar um produto válido', () => {
      const product = new Product(
        validProductData.id,
        validProductData.name,
        validProductData.description,
        validProductData.price,
        validProductData.categoryId,
        validProductData.stock,
        validProductData.image,
        validProductData.createdAt,
        validProductData.updatedAt,
      );

      expect(product.id).toBe(validProductData.id);
      expect(product.name).toBe(validProductData.name);
      expect(product.description).toBe(validProductData.description);
      expect(product.price).toBe(validProductData.price);
      expect(product.categoryId).toBe(validProductData.categoryId);
      expect(product.stock).toBe(validProductData.stock);
      expect(product.image).toBe(validProductData.image);
      expect(product.createdAt).toBe(validProductData.createdAt);
      expect(product.updatedAt).toBe(validProductData.updatedAt);
    });

    it('deve lançar erro quando nome está vazio', () => {
      expect(() => {
        new Product(
          validProductData.id,
          '',
          validProductData.description,
          validProductData.price,
          validProductData.categoryId,
          validProductData.stock,
          validProductData.image,
          validProductData.createdAt,
          validProductData.updatedAt,
        );
      }).toThrow('O nome do produto é obrigatório.');
    });

    it('deve lançar erro quando descrição está vazia', () => {
      expect(() => {
        new Product(
          validProductData.id,
          validProductData.name,
          '',
          validProductData.price,
          validProductData.categoryId,
          validProductData.stock,
          validProductData.image,
          validProductData.createdAt,
          validProductData.updatedAt,
        );
      }).toThrow('A descrição do produto é obrigatória.');
    });

    it('deve lançar erro quando preço é zero ou negativo', () => {
      expect(() => {
        new Product(
          validProductData.id,
          validProductData.name,
          validProductData.description,
          0,
          validProductData.categoryId,
          validProductData.stock,
          validProductData.image,
          validProductData.createdAt,
          validProductData.updatedAt,
        );
      }).toThrow('O preço do produto é obrigatório e deve ser maior que zero.');

      expect(() => {
        new Product(
          validProductData.id,
          validProductData.name,
          validProductData.description,
          -10,
          validProductData.categoryId,
          validProductData.stock,
          validProductData.image,
          validProductData.createdAt,
          validProductData.updatedAt,
        );
      }).toThrow('O preço do produto é obrigatório e deve ser maior que zero.');
    });

    it('deve lançar erro quando categoryId está vazio', () => {
      expect(() => {
        new Product(
          validProductData.id,
          validProductData.name,
          validProductData.description,
          validProductData.price,
          '',
          validProductData.stock,
          validProductData.image,
          validProductData.createdAt,
          validProductData.updatedAt,
        );
      }).toThrow('O ID da categoria é obrigatório.');
    });

    it('deve lançar erro quando estoque é nulo', () => {
      expect(() => {
        new Product(
          validProductData.id,
          validProductData.name,
          validProductData.description,
          validProductData.price,
          validProductData.categoryId,
          null as any,
          validProductData.image,
          validProductData.createdAt,
          validProductData.updatedAt,
        );
      }).toThrow('O estoque é obrigatório.');
    });
  });

  describe('métodos de alteração', () => {
    let product: Product;

    beforeEach(() => {
      product = new Product(
        validProductData.id,
        validProductData.name,
        validProductData.description,
        validProductData.price,
        validProductData.categoryId,
        validProductData.stock,
        validProductData.image,
        validProductData.createdAt,
        validProductData.updatedAt,
      );
    });

    describe('changeName', () => {
      it('deve alterar o nome do produto', () => {
        const newName = 'Updated Product Name';
        product.changeName(newName);
        expect(product.name).toBe(newName);
      });

      it('deve lançar erro quando nome está vazio', () => {
        expect(() => product.changeName('')).toThrow('O nome do produto é obrigatório.');
      });
    });

    describe('changeDescription', () => {
      it('deve alterar a descrição do produto', () => {
        const newDescription = 'Updated Product Description';
        product.changeDescription(newDescription);
        expect(product.description).toBe(newDescription);
      });

      it('deve lançar erro quando descrição está vazia', () => {
        expect(() => product.changeDescription('')).toThrow('A descrição do produto é obrigatória.');
      });
    });

    describe('changePrice', () => {
      it('deve alterar o preço do produto', () => {
        const newPrice = 149.99;
        product.changePrice(newPrice);
        expect(product.price).toBe(newPrice);
      });

      it('deve lançar erro quando preço é zero ou negativo', () => {
        expect(() => product.changePrice(0)).toThrow('O preço do produto é obrigatório e deve ser maior que zero.');
        expect(() => product.changePrice(-10)).toThrow('O preço do produto é obrigatório e deve ser maior que zero.');
      });
    });

    describe('changeCategoryId', () => {
      it('deve alterar o categoryId do produto', () => {
        const newCategoryId = 'new-category-456';
        product.changeCategoryId(newCategoryId);
        expect(product.categoryId).toBe(newCategoryId);
      });

      it('deve lançar erro quando categoryId está vazio', () => {
        expect(() => product.changeCategoryId('')).toThrow('O ID da categoria é obrigatório.');
      });
    });

    describe('changeStock', () => {
      it('deve alterar o estoque do produto', () => {
        const newStock = new ProductStock(20);
        product.changeStock(newStock);
        expect(product.stock).toBe(newStock);
      });

      it('deve lançar erro quando estoque é nulo', () => {
        expect(() => product.changeStock(null as any)).toThrow('O estoque é obrigatório.');
      });
    });

    describe('changeImage', () => {
      it('deve alterar a imagem do produto', () => {
        const newImage = 'https://example.com/new-image.jpg';
        product.changeImage(newImage);
        expect(product.image).toBe(newImage);
      });
    });
  });
});
