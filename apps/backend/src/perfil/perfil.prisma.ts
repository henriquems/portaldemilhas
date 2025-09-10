import { Injectable } from '@nestjs/common';
import { RepositorioPerfil, Perfil } from '@portaldemilhas/core';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class PerfilPrisma implements RepositorioPerfil {
    constructor(private readonly prisma: PrismaService){}

    async listar(): Promise<Perfil[]> {
        return this.prisma.perfil.findMany()
    }

    async salvar(perfil: Perfil): Promise<void> {
        await this.prisma.perfil.upsert({
            where: { id: perfil.id ?? -1 },
            update: perfil,
            create: perfil as any
        })
    }

    async buscarPorNome(nome: string): Promise<Perfil | null> {
        return this.prisma.perfil.findUnique({
            where: { nome }
        })
    }
}