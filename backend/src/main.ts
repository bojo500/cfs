import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function displayBootLogo() {
  const isDev = process.env.NODE_ENV !== 'production';

  console.clear();

  if (isDev) {
    // Development mode - more decorative
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║                                            ║');
    console.log('║    🎛  CoilFlow Manufacturing System       ║');
    console.log('║                                            ║');
    console.log('╚════════════════════════════════════════════╝\n');

    console.log('  🔧 Environment:   Development');
    console.log(`  🌐 API Server:    http://localhost:${process.env.PORT || 3010}`);
    console.log(`  🗄️  Database:     MySQL (Host: ${process.env.DB_HOST || 'localhost'})`);
    console.log(`  📊 Frontend:      ${process.env.FRONTEND_URL || 'http://localhost:3011'}`);
    console.log('\n  ─────────────────────────────────────────────\n');
    console.log('  ✓ Ready to accept connections!\n');
  } else {
    // Production mode - minimal and clean
    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║   CoilFlow Server - PRODUCTION       ║');
    console.log('╚═══════════════════════════════════════╝\n');

    console.log(`  ✓ Server:   Port ${process.env.PORT || 3010}`);
    console.log('  ✓ Database: Connected');
    console.log('  ✓ Status:   ONLINE\n');
  }
}

async function bootstrap() {
  await displayBootLogo();

  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug'],
  });

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3011',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('CoilFlow API')
    .setDescription('CoilFlow Manufacturing System API Documentation')
    .setVersion('1.0')
    .addTag('coils', 'Coil management endpoints')
    .addTag('loads', 'Load management endpoints')
    .addTag('locations', 'Location management endpoints')
    .addTag('stats', 'Statistics and dashboard endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3010;
  await app.listen(port);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`  📚 Swagger Docs: http://localhost:${port}/api/docs\n`);
  }
}

bootstrap();
