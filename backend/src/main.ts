import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const frontendOrigin =
    configService.get<string>("FRONTEND_ORIGIN") ?? "http://localhost:3002";
  const port = Number(configService.get<string>("PORT") ?? 3001);

  app.enableCors({
    origin: frontendOrigin,
  });

  await app.listen(port);
}

void bootstrap();
