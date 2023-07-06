import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryServiceInterface } from 'src/interfaces/category/category-service.interface';
import { CategoryEntity } from './category.entity';
import { CategoryRepository } from './cateogory.repository';

@Injectable()
export class CategoryService implements CategoryServiceInterface {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
  ) {}

  async getCategories(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find();
  }
}
