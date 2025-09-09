import { Product } from "src/core/products/entities/product";
export abstract class IProductDataSource {
    abstract save(product: Product): Promise<Product>
    abstract findAll(): Promise<Product[]>
    abstract findById(id: string): Promise<Product | null>
    abstract delete(id: string): Promise<void>
    abstract findByCategory(categoryId: string): Promise<Product[]>
    abstract findManyByIds(ids: string[]): Promise<Product[]>
    abstract update(product: Product): Promise<void>
}