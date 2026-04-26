"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ["error", "warn", "log", "debug"],
    });
    const logger = new common_1.Logger("Bootstrap");
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.enableCors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    });
    app.setGlobalPrefix("api/v1");
    if (process.env.NODE_ENV !== "production") {
        const config = new swagger_1.DocumentBuilder()
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
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup("api/docs", app, document, {
            swaggerOptions: { persistAuthorization: true },
        });
        logger.log("Swagger docs available at /api/docs");
    }
    const port = process.env.PORT || 4000;
    await app.listen(port);
    logger.log(`CyberQELN API running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map