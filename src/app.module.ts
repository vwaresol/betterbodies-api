import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config/schemas/config.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { conectionConfigAsync } from './config/typeorm/conection.config';
import { UserProfileModule } from './modules/user-profile/user-profile.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { PhotoModule } from './modules/photo/photo.module';
import { GalleryModule } from './modules/gallery/gallery.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync(conectionConfigAsync),
    AuthModule,
    UserProfileModule,
    ProductModule,
    OrderModule,
    PhotoModule,
    GalleryModule,
  ],
})
export class AppModule {}
