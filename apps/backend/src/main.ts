import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    app.setGlobalPrefix("api");

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    );

    const swaggerCfg = new DocumentBuilder().setTitle("Next User-Manager API").setDescription("CRUD for users").setVersion("1.0.0").build();

    const document = SwaggerModule.createDocument(app, swaggerCfg);
    SwaggerModule.setup("docs", app, document);

    const port = Number(process.env.PORT) || 3001;
    await app.listen(port);
    console.log(`Backend ready at http://localhost:${port}/api`);
}
bootstrap();
