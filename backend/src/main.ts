import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug"],
  });

  const logger = new Logger("Bootstrap");

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix("api/v1");

  // Swagger documentation
  if (process.env.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
      .setTitle("CyberQELN API")
      .setDescription("Главная киберспортивная платформа СНГ — REST API")
      .setVersion("1.0")
      .addBearerAuth()
      .addTag("auth", "Аутентификация")
      .addTag("users", "Пользователи")
      .addTag("tournaments", "Турниры")
      .addTag("teams", "Команды")
      .addTag("matches", "Матчи")
      .addTag("rankings", "Рейтинг")
      .addTag("shop", "Магазин")
      .addTag("community", "Сообщество")
      .addTag("media", "Медиа")
      .addTag("admin", "Администрирование")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    logger.log("Swagger docs available at /api/docs");
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`CyberQELN API running on port ${port}`);
}

bootstrap();
