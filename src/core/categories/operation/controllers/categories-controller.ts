import { ICategoryDataSource } from "src/interfaces/category-datasource";
import { CategoryGateway } from "../gateways/categories-gateway";
import { CategoryUseCase } from "../../usecases/category-usecase";
import { CategoriesPresenter } from "../presenters/categories-presenter";

export class CategoriesController {
  static async findAll(dataSource: ICategoryDataSource) {
    const categoryGateway = new CategoryGateway(dataSource);

    const categories = await CategoryUseCase.findAll(categoryGateway); 
    
    return CategoriesPresenter.toDTO(categories);
  }
}