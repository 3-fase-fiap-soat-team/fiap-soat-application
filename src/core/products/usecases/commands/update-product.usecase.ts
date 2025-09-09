import { Product } from '../../entities/product';
import { ProductGateway } from '../../operation/gateways/product-gateway';
import { CategoryGateway } from 'src/core/categories/operation/gateways/categories-gateway';

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  stock?: number;
  image?: string;
}

export class UpdateProductUseCase {
  static async execute(
    productGateway: ProductGateway,
    categoryGateway: CategoryGateway,
    id: string,
    updateData: UpdateProductDTO,
  ): Promise<Product> {
    const product = await productGateway.findById(id);
    
    if (!product) {
      throw new Error('Product not found');
    }

    // Validar categoria se foi alterada
    if (updateData.categoryId && updateData.categoryId !== product.categoryId) {
      const category = await categoryGateway.findById(updateData.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    // Atualizar campos se fornecidos
    if (updateData.name !== undefined) {
      product.changeName(updateData.name);
    }
    
    if (updateData.description !== undefined) {
      product.changeDescription(updateData.description);
    }
    
    if (updateData.price !== undefined) {
      product.changePrice(updateData.price);
    }
    
    if (updateData.categoryId !== undefined) {
      product.changeCategoryId(updateData.categoryId);
    }
    
    if (updateData.stock !== undefined) {
      const currentStock = product.stock.value;
      const difference = updateData.stock - currentStock;
      
      if (difference !== 0) {
        const newStock = difference > 0 
          ? product.stock.increase(difference)
          : product.stock.decrease(Math.abs(difference));
        product.changeStock(newStock);
      }
    }
    
    if (updateData.image !== undefined) {
      product.changeImage(updateData.image);
    }

    await productGateway.save(product);
    return product;
  }
}
