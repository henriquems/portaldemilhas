import { Injectable } from '@nestjs/common';
import { RepositorioPrograma, Programa } from '@portaldemilhas/core';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class ProgramaPrisma implements RepositorioPrograma {
    constructor(private readonly prisma: PrismaService){}

    async listar(page: string, pageSize: string): Promise<{ total: number, itens: Programa[] }> {
        const pag = Math.max(1, parseInt(page) || 1);
        const tam = Math.max(1, parseInt(pageSize) || 10);

        const total = await this.prisma.programa.count();

        const data = await this.prisma.programa.findMany({
            skip: (pag - 1) * tam,
            take: tam,
            orderBy: {
                descricao: "asc"
            }
        });

        return { total, itens: data };
    }

    async listarTodos(): Promise<Programa[]> {
        return this.prisma.programa.findMany()
    }

    async recuperar(valor: number): Promise<Programa | null> {
        const id = Number(valor)

        const programa = await this.prisma.programa.findUnique({
            where: { id },
        })

        if (!programa) return null;

        return programa;
    }

    async excluir(valor: number): Promise<void> {
        const id = Number(valor)

        await this.prisma.programa.delete({
          where: { id },
        });
    }

    async salvar(programa: Programa): Promise<void> {
        if (programa.id) {
            await this.prisma.programa.upsert({
                where: {
                    id: programa.id,
                },
                create: {
                    descricao: programa.descricao,
                    companhia: programa.companhia,
                },
                update: {
                    descricao: programa.descricao,
                    companhia: programa.companhia,
                },
            });
        } else {
            await this.prisma.programa.create({
                data: {
                   descricao: programa.descricao,
                   companhia: programa.companhia,
                },
            });
        }
    }
}
