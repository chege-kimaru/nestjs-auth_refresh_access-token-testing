import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const setupOpenApiDoc = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Freterium')
        .setDescription('Freterium API')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
}