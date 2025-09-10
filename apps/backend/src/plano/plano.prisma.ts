import { Injectable } from '@nestjs/common';
import { Plano, RepositorioPlano } from '@portaldemilhas/core';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class PlanoPrisma implements RepositorioPlano {
    constructor(private readonly prisma: PrismaService){}

    async listar(page: string, pageSize: string): Promise<{ total: number, itens: Plano[] }> {
        const pag = Math.max(1, parseInt(page) || 1);
        const tam = Math.max(1, parseInt(pageSize) || 10);

        const total = await this.prisma.plano.count();

        const data = await this.prisma.plano.findMany({
            skip: (pag - 1) * tam,
            take: tam,
            orderBy: {
                descricao: "asc"
            }
        });

        return {
            total,
            itens: data.map(plano => ({
                ...plano,
                valor: Number(plano.valor),
            })),
        };
    }

    async recuperar(valor: number): Promise<Plano | null> {
        const id = Number(valor)

        const plano = await this.prisma.plano.findUnique({
            where: { id },
        })

        if (!plano) return null;

        return {
            ...plano,
            valor: Number(plano.valor.toFixed(2)),
        };
    }

    async excluir(valor: number): Promise<void> {
        const id = Number(valor)

        await this.prisma.plano.delete({
          where: { id },
        });
    }

    async salvar(plano: Plano): Promise<void> {
        if (plano.id) {
            await this.prisma.plano.upsert({
                where: {
                    id: plano.id,
                },
                create: {
                    descricao: plano.descricao,
                    dias: plano.dias,
                    valor: plano.valor
                },
                update: {
                    descricao: plano.descricao,
                    dias: plano.dias,
                    valor: plano.valor
                },
            });
        } else {
            await this.prisma.plano.create({
                data: {
                    descricao: plano.descricao,
                    dias: plano.dias,
                    valor: plano.valor
                },
            });
        }
    }
}
