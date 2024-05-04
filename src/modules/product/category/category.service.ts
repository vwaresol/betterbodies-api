import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getCategoryId(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }
}
