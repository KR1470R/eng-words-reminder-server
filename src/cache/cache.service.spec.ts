import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(async () => {
    const FakeConfigService = {
      provide: ConfigService,
      useValue: {
        get: jest.fn((key: string, defaultValue?: string) => {
          switch (key) {
            case 'SERVER_PORT':
              return 3000;
              break;
            case 'REDIS_CACHE_HOST':
              return 'localhost';
              break;
            case 'REDIS_CACHE_PORT':
              return 6379;
              break;
            default:
              return defaultValue;
          }
        }),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RedisModule.forRootAsync({
          // imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            config: [
              {
                namespace: 'Cache',
                host: configService.get('REDIS_CACHE_HOST'),
                port: Number(configService.get('REDIS_CACHE_PORT')),
              },
            ],
          }),
          // inject: [FakeConfigService],
        }),
      ],
      providers: [CacheService, FakeConfigService],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return all users without an error', () => {
    expect(service.getAllUsersIds()).toHaveBeenCalled();
  });
});
