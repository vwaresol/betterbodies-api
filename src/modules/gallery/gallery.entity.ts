import { AbstractEntity } from 'src/common/entities/abstract-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CategoryEntity } from '../product/category/category.entity';

@Entity({ name: 'gallery' })
export class GalleryEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  url: string;

  @ManyToOne(() => CategoryEntity, (category) => category.gallery)
  category: CategoryEntity;
}
