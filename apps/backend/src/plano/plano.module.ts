import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PlanoController } from './plano.controller';
import { DbModule } from 'src/db/db.module';
import { PlanoPrisma } from './plano.prisma';
import { AuthModule } from 'src/auth/auth.module';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  imports: [DbModule, AuthModule],
  controllers: [PlanoController],
  providers: [PlanoPrisma],
})
export class PlanoModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(PlanoController)
  }
}