import { Module } from '@nestjs/common';
import { databaseModule } from './database/database.module';
import { storageModule } from './storage/storage.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [databaseModule, storageModule, ConfigModule.forRoot({
        envFilePath: 'env',
        isGlobal:true,
  })],
  providers: [],
  exports: [],
})
export class CoreModule {}
