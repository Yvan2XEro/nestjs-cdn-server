import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, } from '@nestjs/config';
import * as Joi from 'joi';
import { ImagesModule } from './modules/images/images.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, validationSchema: Joi.object({
        PORT: Joi.number().required(),
        ALLOWED_EXTENSIONS: Joi.string().optional(),
      }),
      validationOptions: {
        abortEarly: true,
      }
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
