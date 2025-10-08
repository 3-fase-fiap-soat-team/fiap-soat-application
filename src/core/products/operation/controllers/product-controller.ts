import { IProductDataSource } from 'src/interfaces/product-datasource';
import { ProductGateway } from '../gateways/product-gateway';
import { ProductUseCase, UpdateProductDTO } from '../../usecases/product-usecase';
import { ProductPresenter } from '../presenters/product-presenter';
import { ProductIdPresenter } from '../presenters/product-id-presenter';
import { NewProductDTO } from 'src/core/common/dtos/new-product.dto';
import { ICategoryDataSource } from 'src/interfaces/category-datasource';
import { CategoryGateway } from 'src/core/categories/operation/gateways/categories-gateway';
import { ProductFactory } from '../../entities/factories/product.factory';
import { IdGenerator } from 'src/interfaces/id-generator';

export class ProductController {
  static async findAll(dataSource: IProductDataSource) {
    const productGateway = new ProductGateway(dataSource);
    const products = await ProductUseCase.findAll(productGateway);
    return ProductPresenter.toDTO(products);
  }

  static async findById(id: string, dataSource: IProductDataSource) {
    const productGateway = new ProductGateway(dataSource);
    const product = await ProductUseCase.findById(productGateway, id);
    
    if (!product) {
      return null;
    }
    
    return ProductPresenter.toDTO([product])[0];
  }

  static async findByCategory(
    categoryId: string,
    dataSource: IProductDataSource,
  ) {
    const productGateway = new ProductGateway(dataSource);
    const products = await ProductUseCase.findByCategory(
      productGateway,
      categoryId,
    );
    return ProductPresenter.toDTO(products);
  }

  static async save(
    product: NewProductDTO,
    categoryDataSource: ICategoryDataSource,
    productDataSource: IProductDataSource,
    idGenerator: IdGenerator,
  ) {
    const productGateway = new ProductGateway(productDataSource);
    const categoryGateway = new CategoryGateway(categoryDataSource);
    const factory = new ProductFactory(idGenerator);

    const productSaved = await ProductUseCase.save(
      product,
      categoryGateway,
      productGateway,
      factory,
    );
    return ProductIdPresenter.toDTO(productSaved);
  }

  static async update(
    id: string,
    updateData: UpdateProductDTO,
    categoryDataSource: ICategoryDataSource,
    productDataSource: IProductDataSource,
  ) {
    const productGateway = new ProductGateway(productDataSource);
    const categoryGateway = new CategoryGateway(categoryDataSource);

    const updatedProduct = await ProductUseCase.update(
      productGateway,
      categoryGateway,
      id,
      updateData,
    );
    
    return ProductPresenter.toDTO([updatedProduct])[0];
  }

  static async delete(id: string, dataSource: IProductDataSource) {
    const productGateway = new ProductGateway(dataSource);
    await ProductUseCase.delete(productGateway, id);
  }
}
