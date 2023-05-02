import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppExceptionFilter } from './common/exception-filters/app-exception.filter';
import { AppLoggingInterceptor } from './common/interceptors/app-logging.interceptor';
import { FilterFieldsInterceptor } from './common/interceptors/filter-fields.interceptor';
import { typeOrmConfig } from './config/typeorm.config';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';

@Module({
    providers: [
        {
            provide: APP_FILTER,
            useClass: AppExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: AppLoggingInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: FilterFieldsInterceptor,
        },
    ],
    imports: [
        WinstonModule.forRoot(winstonConfig),
        TypeOrmModule.forRoot(typeOrmConfig),
    ],
})
export class AppModule {}
