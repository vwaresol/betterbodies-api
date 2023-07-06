import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductFilterDto } from 'src/dtos/product/product-filter.dto';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { CreateProductDto } from 'src/dtos/product/create-product.dto';
import { UpdateProductDto } from 'src/dtos/product/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(
    private productService: ProductService,
    private configService: ConfigService,
  ) {}

  @Get()
  get(
    @Query() productFilterDto: ProductFilterDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<ProductEntity>> {
    limit = limit > 50 ? 50 : limit;
    return this.productService.get(productFilterDto, {
      page,
      limit,
      route: this.configService.get('HOST'),
    });
  }
  // @Get('/search')
  // async search(@Query() queryParams: SearchProductDto): Promise<any> {
  //   return await this.productService.search(queryParams);
  // }
  @Get(':id')
  getProductById(@Param('id') id: string): Promise<ProductEntity> {
    return this.productService.getProductById(id);
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  create(@Body() createProduct: CreateProductDto): Promise<ProductEntity> {
    return this.productService.create(createProduct);
  }

  @Put('/:id/update')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateProduct: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.update(id, updateProduct);
  }

  @Delete('/:id/delete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  delete(@Param('id') id: string): Promise<void> {
    return this.productService.delete(id);
  }
}
