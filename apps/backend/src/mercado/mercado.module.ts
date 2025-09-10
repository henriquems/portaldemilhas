import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercado.service';
import { MercadoController } from './mercado.controller';
import { AssinaturaModule } from 'src/assinatura/assinatura.module';
import { EmailService } from 'src/email/email.service'

@Module({
  imports: [AssinaturaModule],
  providers: [MercadoPagoService, EmailService],
  controllers: [MercadoController],
  exports: [MercadoPagoService],
})
export class MercadoPagoModule {}
