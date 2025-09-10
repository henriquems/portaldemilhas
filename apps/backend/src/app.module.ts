import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { UsuarioModule } from './usuario/usuario.module';
import { PerfilModule } from './perfil/perfil.module';
import { ProgramaModule } from './programa/programa.module'
import { AnuncioModule } from './anuncio/anuncio.module'
import { ConfigModule } from '@nestjs/config';
import { PlanoModule } from './plano/plano.module';
import { AssinaturaModule } from './assinatura/assinatura.module';
import { MercadoPagoModule } from './mercado/mercado.module';
import { EmailModule } from './email/email.module';
import { CupomModule } from './cupom/cupom.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DbModule, AuthModule, PerfilModule, UsuarioModule, 
    ProgramaModule, AnuncioModule, PlanoModule, 
    AssinaturaModule, MercadoPagoModule, EmailModule,
    CupomModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
