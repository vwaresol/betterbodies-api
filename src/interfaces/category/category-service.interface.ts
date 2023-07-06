import { CategoryEntity } from 'src/modules/product/category/category.entity';

export interface CategoryServiceInterface {
  getCategories(): Promise<CategoryEntity[]>;
}
