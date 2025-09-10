import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { DbModule } from 'src/db/db.module';
import { AuthPrisma } from './auth.prisma';
import { BcryptProvider } from '../shared/bcrypt.provider';
import { AuthMiddleware } from './auth.middleware';
import { AssinaturaGuard } from './assinatura.guard';
import { JwtService } from './jwt.service';

@Module({
  imports: [DbModule],
  controllers: [AuthController],
  providers: [AuthPrisma, BcryptProvider, AuthMiddleware, AssinaturaGuard, JwtService],
  exports: [AuthMiddleware, AuthPrisma, AssinaturaGuard, JwtService],
})
export class AuthModule {}
