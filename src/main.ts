import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as basicAuth from 'express-basic-auth';
import * as helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { serverConfig } from './config/server.config';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.set('trust proxy', 1);

    app.use(
        '/api',
        basicAuth({
            users: { dev: 'dev#22M1' },
            challenge: true,
        }),
    );

    app.enableCors();
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(helmet());
    app.setGlobalPrefix('v1');
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    const options = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('ReGov School Registration API')
        .setDescription('ReGov School Registration API')
        .setVersion('1.0.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    await app.listen(serverConfig.port);
}
bootstrap();
