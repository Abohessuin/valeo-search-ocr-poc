import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OcrModule } from "./ocr/ocr.module";
import { SearchModule } from "./search/search.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    OcrModule,
    SearchModule
  ]
})
export class AppModule {}
