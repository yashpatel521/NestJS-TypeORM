import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { swaggerCss } from "./swagger";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import { getLocalIpAddress, PORT, ForceLog } from "./constants/constants";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Class Varlidator initialization
  app.useGlobalPipes(new ValidationPipe());

  // Swagger initialization
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("NestJs + TypeORM")
    .setDescription(
      "TOKEN :: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNjY4NDk5MTU1LCJleHAiOjE2NjkzNjMxNTV9.5AMED493aZCkgPn0EFUU3Pot687NLl3P2lTkR9ASln8"
    )
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document, {
    customCss: swaggerCss,
    swaggerOptions: { tagsSorter: "alpha" },
  });

  app.useStaticAssets(join(__dirname, "..", "../public"), {
    index: false,
    prefix: "/public",
  });

  // create a firebase token using login form
  app.use("/firebaseLogin", (_, res) => {
    res.sendFile(join(__dirname, "../../src/firebaseLogin.html"));
  });

  app.use("/firebase-messaging-sw.js", (_, res) => {
    res.sendFile(join(__dirname, "../../src/firebase-messaging-sw.js"));
  });

  // Socket test html frontend file
  app.use("/webSockets", (_, res) => {
    res.sendFile(join(__dirname, "../../src/webSockets.html"));
  });
  //Server initialization on PORT
  await app.listen(PORT);
  ForceLog(`CONNECTED TO DB AND SERVER STARTED ON - ${getLocalIpAddress()}`);
}
bootstrap();
