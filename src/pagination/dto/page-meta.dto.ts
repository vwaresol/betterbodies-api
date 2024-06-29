import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDtoParameters } from '../page-meta-dto-parameters.interface';

export class PageMetaDto {
  @ApiProperty()
  readonly currentPage: number;

  @ApiProperty()
  readonly totalItems: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly totalPages: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.currentPage = pageOptionsDto.page;
    this.totalItems = pageOptionsDto.limit;
    this.itemCount = itemCount;
    this.totalPages = Math.ceil(this.itemCount / this.totalItems);
    this.hasPreviousPage = this.currentPage > 1;
    this.hasNextPage = this.currentPage < this.totalPages;
  }
}
