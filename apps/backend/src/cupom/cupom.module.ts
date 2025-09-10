import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CupomController } from './cupom.controller';
import { DbModule } from 'src/db/db.module';
import { CupomPrisma } from './cupom.prisma';
import { BcryptProvider } from '../shared/bcrypt.provider';
import { AuthModule } from 'src/auth/auth.module';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [DbModule, AuthModule, EmailModule],
  controllers: [CupomController],
  providers: [CupomPrisma, BcryptProvider],
  exports: [CupomPrisma],
})
export class CupomModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(CupomController);
  }
}