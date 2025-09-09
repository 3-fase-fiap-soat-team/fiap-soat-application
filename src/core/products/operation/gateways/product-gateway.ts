import { IProductDataSource } from "src/interfaces/product-datasource";
import { Product } from "../../entities/product";

export class ProductGateway {
    dataSource: IProductDataSource

    constructor(dataSource: IProductDataSource){
        this.dataSource = dataSource
    }

    async save(product: Product): Promise<Product> {
        return await this.dataSource.save(product);
    }

    async findAll(): Promise<Product[]> {
        return await this.dataSource.findAll()
    }

    async findById(id: string): Promise<Product | null> {
        return await this.dataSource.findById(id)
    }
    async delete(id: string): Promise<void> {
        return await this.dataSource.delete(id)
    }
    async findByCategory(categoryId: string): Promise<Product[]> {
        return await this.dataSource.findByCategory(categoryId);
    }

    async findManyByIds(ids: string[]): Promise<Product[]> {
        return await this.dataSource.findManyByIds(ids);
    }
}