import { Module } from '@nestjs/common';
import { PerfilController } from './perfil.controller';
import { DbModule } from 'src/db/db.module';
import { PerfilPrisma } from './perfil.prisma';

@Module({
  imports: [DbModule],
  controllers: [PerfilController],
  providers: [PerfilPrisma]
})
export class PerfilModule {}
