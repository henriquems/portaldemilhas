import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AssinaturaController } from './assinatura.controller';
import { DbModule } from 'src/db/db.module';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { AssinaturaPrisma } from './assinatura.prisma';
import { AuthModule } from 'src/auth/auth.module';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { MercadoPagoService } from 'src/mercado/mercado.service';
import { CupomPrisma } from 'src/cupom/cupom.prisma';
import { AssinaturaService } from './assinatura.service';

@Module({
  imports: [DbModule, AuthModule, UsuarioModule],
  controllers: [AssinaturaController],
  providers: [AssinaturaPrisma, CupomPrisma, MercadoPagoService, AssinaturaService],
  exports: [AssinaturaPrisma],
})
export class AssinaturaModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AssinaturaController)
  }
}