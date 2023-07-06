import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductFilterDto } from 'src/dtos/product/product-filter.dto';
import { ProductRepository } from './product.repository';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ProductEntity } from './product.entity';
import { CreateProductDto } from 'src/dtos/product/create-product.dto';
import { UpdateProductDto } from 'src/dtos/product/update-product.dto';
import { ItemCartDto } from 'src/dtos/order/item-cart.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async get(
    productFilterDto: ProductFilterDto,
    paginationOpts: IPaginationOptions,
  ): Promise<Pagination<ProductEntity>> {
    return this.productRepository.getProducts(productFilterDto, paginationOpts);
  }

  async getProductById(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories', 'photos'],
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    return await this.productRepository.createProduct(createProductDto);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return await this.productRepository.updateProduct(id, updateProductDto);
  }

  async delete(id: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    await this.productRepository.softDelete(id);
  }
  // async search(queryParams: any): Promise<any> {
  //   const data = ProductSearchObject.searchObject(queryParams);
  //   return await this.elasticService.searchIndex(data);
  // }
  async processProducts(products: ItemCartDto[]): Promise<ItemCartDto[]> {
    return await Promise.all(
      products.map(async (item) => {
        const itemDB = await this.getProductById(item.id);
        return {
          ...item,
          ...itemDB,
          totalPrice: itemDB.price * item.total,
        };
      }),
    );
  }
}
