import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProgramaController } from './programa.controller';
import { DbModule } from 'src/db/db.module';
import { ProgramaPrisma } from './programa.prisma';
import { AuthModule } from 'src/auth/auth.module';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  imports: [DbModule, AuthModule],
  controllers: [ProgramaController],
  providers: [ProgramaPrisma],
})
export class ProgramaModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: 'programas/todos',
          method: RequestMethod.GET,
        }
      )
      .forRoutes(ProgramaController);
  }
}