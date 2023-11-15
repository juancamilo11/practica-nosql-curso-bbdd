import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType, createClient } from 'redis';

@Injectable()
export class ProductsRedisConfig {
  private _client: RedisClientType;
  private logger: Logger = new Logger(ProductsRedisConfig.name);

  public constructor(private configService: ConfigService) {
    const url = this.configService.getOrThrow<string>('redisProductsDbUrl');
    const name = this.configService.getOrThrow<string>('redisProductsDbName');
    console.log({ url, name });
    this._client = createClient({
      url,
      name,
    });

    this._client
      .connect()
      .then(() =>
        this.logger.log(`🟢 Redis: Connection successful to ${name}`),
      );
  }

  public get client(): RedisClientType {
    return this._client;
  }
}
