import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType, Logger, LogLevel } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // SECURITY FIX: Conditional logging based on environment
  const nodeEnv = process.env.NODE_ENV || 'development';
  const logLevels: any[] = nodeEnv === 'production' 
    ? ['error', 'warn', 'log'] 
    : ['error', 'warn', 'log', 'debug', 'verbose'];

  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3000);
  const apiPrefix = configService.get<string>('app.apiPrefix', 'api');

  // Security
  app.use(helmet());

  // SECURITY FIX: Proper CORS configuration
  const corsOrigin = configService.get<string>('app.corsOrigin');
  
  // Validate CORS in production
  if (nodeEnv === 'production' && (!corsOrigin || corsOrigin === '*')) {
    throw new Error(
      'CRITICAL SECURITY ERROR: CORS_ORIGIN must be set to specific domain(s) in production. ' +
      'Never use "*" with credentials enabled!'
    );
  }

  app.enableCors({
    origin: corsOrigin || 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-HTTP-Method-Override', 'Accept', 'Observe'],
  });

  // Health check route outside global prefix
  app.getHttpAdapter().get('/api/v1/health', (req, res) => {
    res.status(200).send({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Prefix
  app.setGlobalPrefix(apiPrefix);

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // SECURITY FIX: Conditional Swagger (only in development/staging)
  const enableSwagger = configService.get<boolean>('app.enableSwagger', true);
  
  if (nodeEnv === 'production' && enableSwagger) {
    logger.warn(
      '⚠️  WARNING: Swagger is enabled in production! ' +
      'Set ENABLE_SWAGGER=false in production for security.'
    );
  }

  if (enableSwagger && nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Kahade API')
      .setDescription('P2P Escrow Platform API Documentation')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management endpoints')
      .addTag('transactions', 'Transaction management endpoints')
      .addTag('disputes', 'Dispute resolution endpoints')
      .addTag('notifications', 'Notification endpoints')
      .addTag('blockchain', 'Blockchain integration endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
    
    logger.log(`📚 Swagger documentation: http://localhost:${port}/${apiPrefix}/docs`);
  }

  await app.listen(port, '0.0.0.0');
  
  // SECURITY FIX: Remove verbose console.log in production
  if (nodeEnv !== 'production') {
    logger.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
  } else {
    logger.log(`Application started on port ${port}`);
  }
}

bootstrap();
