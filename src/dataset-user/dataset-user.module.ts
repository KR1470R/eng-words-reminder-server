import { Module } from '@nestjs/common';
import { DatasetUserService } from './dataset-user.service';
import { DatasetService } from 'src/dataset/dataset.service';
import { CacheModule } from 'src/cache/cache.module';
import { DatasetUserController } from './dataset-user.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [CacheModule, JwtModule],
  providers: [DatasetUserService, DatasetService],
  controllers: [DatasetUserController],
})
export class DatasetUserModule {}
