import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { productErrorsConst, sortColumns } from 'src/const/product.const';
import { CreateProductDto } from 'src/dtos/product/create-product.dto';
import { ProductFilterDto } from 'src/dtos/product/product-filter.dto';
import { UpdateProductDto } from 'src/dtos/product/update-product.dto';
import { DataSource, In, Repository } from 'typeorm';
import { CategoryEntity } from './category/category.entity';
import { CategoryRepository } from './category/cateogory.repository';
import { ProductEntity } from './product.entity';
import { PageDto } from 'src/pagination/dto/page.dto';
import { PageOptionsDto } from 'src/pagination/dto/page-options.dto';
import { PageMetaDto } from 'src/pagination/dto/page-meta.dto';

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
  constructor(
    dataSource: DataSource,
    private categoriesRepository: CategoryRepository,
  ) {
    super(ProductEntity, dataSource.createEntityManager());
  }

  async createProduct(data: CreateProductDto): Promise<ProductEntity> {
    const categories = await this.getCategories(data.categories);

    const product = this.create({
      ...data,
      categories,
    });

    try {
      await this.save(product);

      return product;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        productErrorsConst.ERROR_CREATING_PRODUCT,
      );
    }
  }

  async updateProduct(
    id: string,
    data: UpdateProductDto,
  ): Promise<ProductEntity> {
    const categories = await this.getCategories(data.categories);

    const product = await this.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(productErrorsConst.ERROR_PRODUCT_NOT_FOUND);
    }

    product.name = data.name;
    product.description = data.description;
    product.sku = data.sku;
    product.barcode = data.barcode;
    product.price = data.price;
    product.salePrice = data.price;
    product.quantity = data.quantity;
    product.categories = categories;
    this.save(product);

    return product;
  }

  async getProducts(
    { cat, q, column, sort, limit }: ProductFilterDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProductEntity>> {
    const query = this.createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoinAndSelect('product.photos', 'photos')
      .where('product.isActive = TRUE');

    if (cat) {
      query.andWhere('categories.id = :category', { category: cat });
    }

    if (q) {
      query.andWhere(
        "(LOWER(product.name) LIKE CONCAT('%', LOWER(:search), '%') OR product.sku = :search OR LOWER(categories.name) LIKE CONCAT('%', LOWER(:search), '%'))",
        { search: q },
      );
    }

    if (column && sort) {
      query.orderBy(sortColumns[column], sort);
    }

    if (limit) {
      query
        .skip((pageOptionsDto.page - 1) * pageOptionsDto.limit)
        .take(pageOptionsDto.limit);
    }

    const itemCount = await query.getCount();
    const { entities } = await query.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    try {
      return new PageDto(entities, pageMetaDto);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getCategories(categories: string[]): Promise<CategoryEntity[]> {
    return await this.categoriesRepository.find({
      where: { id: In(categories) },
    });
  }
}
