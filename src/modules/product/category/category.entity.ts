import { Exclude } from 'class-transformer';
import { GalleryEntity } from 'src/modules/gallery/gallery.entity';
import { GalleryImageEntity } from 'src/modules/image/gallery-image.entity';
import {
  Column,
  CreateDateColumn,
  TreeParent,
  TreeChildren,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'category' })
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('uuid', { name: 'parentId', nullable: true })
  parentId: string;

  @TreeParent()
  parent: CategoryEntity;

  @TreeChildren()
  children: CategoryEntity[];

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @OneToMany(() => GalleryEntity, (gallery) => gallery.category)
  gallery: GalleryEntity;

  @OneToMany(() => GalleryImageEntity, (image) => image.category)
  image: GalleryImageEntity;
}
