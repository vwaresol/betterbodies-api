import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export default class ConectionConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
      autoLoadEntities: true,
      logging: false,
      // migrationsTableName: 'migrations',
      // migrations: ['./database/migrations/*.ts'],
    };
  }
}

export const conectionConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> =>
    ConectionConfig.getOrmConfig(configService),
  inject: [ConfigService],
};
