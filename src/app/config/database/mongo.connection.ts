import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose, { Connection } from 'mongoose';

@Injectable()
export class MongoDBConfig {
  private _client: Connection = mongoose.connection;
  private readonly logger: Logger = new Logger(MongoDBConfig.name);

  constructor(private configService: ConfigService) {
    const url = this.configService.getOrThrow<string>('databaseUri');
    this._client = mongoose.createConnection(url);

    this.logger.log(`🟢 DB: Connection successful to Database ${url}`);
  }

  get client(): mongoose.Connection {
    return this._client;
  }
}
