import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { DbModule } from 'src/db/db.module';
import { UsuarioPrisma } from './usuario.prisma';
import { BcryptProvider } from '../shared/bcrypt.provider';
import { AuthModule } from 'src/auth/auth.module';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [DbModule, AuthModule, EmailModule],
  controllers: [UsuarioController],
  providers: [UsuarioPrisma, BcryptProvider],
  exports: [UsuarioPrisma],
})
export class UsuarioModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'usuarios/novaSenha', method: RequestMethod.POST },
        { path: 'usuarios/cadastro', method: RequestMethod.POST }
      )
      .forRoutes(UsuarioController);
  }
}