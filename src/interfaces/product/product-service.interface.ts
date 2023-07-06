import { ProductFilterDto } from 'src/dtos/product/product-filter.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ProductEntity } from 'src/modules/product/product.entity';
import { CreateProductDto } from 'src/dtos/product/create-product.dto';
import { UpdateProductDto } from 'src/dtos/product/update-product.dto';

export interface ProductServiceInterface {
  get(
    productFilterDto: ProductFilterDto,
    paginateOpts: IPaginationOptions,
  ): Promise<Pagination<ProductEntity>>;
  getProductById(id: string): Promise<ProductEntity>;
  create(productDto: CreateProductDto): Promise<ProductEntity>;
  search(q: any): Promise<any>;
  // processProducts(ids: ItemCartDto[]): Promise<ItemCartDto[]>;
  update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity>;
  delete(id: string): Promise<void>;
}
