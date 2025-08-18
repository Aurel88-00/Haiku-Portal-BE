import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './Modules/auth/auth.module';
import { AuthorModule } from './Modules/author/author.module';
import { HaikuModule } from './Modules/haiku/haiku.module';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './lib/common/global-expection.filter';

const mongoURI = process.env.MONGO_CONNECTION_URI as string;

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 6000,
          limit: 10,
        },
      ],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 120000,
    }),
    MongooseModule.forRoot(mongoURI),
    AuthModule,
    AuthorModule,
    HaikuModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

