import { AbstractEntity } from 'src/common/entities/abstract-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CategoryEntity } from '../product/category/category.entity';

@Entity({ name: 'image' })
export class GalleryImageEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  path: string;

  @ManyToOne(() => CategoryEntity, (category) => category.image)
  category: CategoryEntity;
}
