import { Module } from '@nestjs/common';
import { DatasetUserService } from './dataset-user.service';
import { DatasetService } from 'src/dataset/dataset.service';
import { CacheModule } from 'src/cache/cache.module';
import { DatasetUserController } from './dataset-user.controller';

@Module({
  imports: [CacheModule],
  providers: [DatasetUserService, DatasetService],
  controllers: [DatasetUserController],
})
export class DatasetUserModule {}
