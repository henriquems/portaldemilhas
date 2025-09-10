import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AnuncioController } from './anuncio.controller';
import { DbModule } from 'src/db/db.module';
import { AnuncioPrisma } from './anuncio.prisma';
import { AuthModule } from 'src/auth/auth.module';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  imports: [DbModule, AuthModule],
  controllers: [AnuncioController],
  providers: [AnuncioPrisma],
})
export class AnuncioModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: 'anuncios/destaque',
          method: RequestMethod.GET,
        }
      )
      .forRoutes(AnuncioController);
  }
}