import { ConflictException, Injectable } from '@nestjs/common';
import { PagamentoInfluencer, RepositorioUsuario, StatusAssinaturaTipo, StatusUsuarioTipo, Usuario } from '@portaldemilhas/core';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class UsuarioPrisma implements RepositorioUsuario {
    constructor(private readonly prisma: PrismaService){}

    async listar(
        page: string,
        pageSize: string,
        nome?: string,
        cpf?: string,
        status?: string,
        perfil?: string
    ): Promise<{ total: number; itens: Usuario[] }> {
        const pag = parseInt(page);
        const tam = parseInt(pageSize);

        const where: any = {};

        if (nome) {
            where.nome = { contains: nome, mode: "insensitive" };
        }

        if (cpf) {
            where.cpf = { contains: cpf };
        }

        if (status) {
            where.status = status as StatusUsuarioTipo;
        }

        if (perfil) {
            where.perfis = {
            some: { nome: { equals: perfil, mode: "insensitive" } },
            };
        }

        const [total, data] = await this.prisma.$transaction([
            this.prisma.usuario.count({ where }),
            this.prisma.usuario.findMany({
            where,
            skip: (pag - 1) * tam,
            take: tam,
            include: {
                perfis: {
                select: { id: true, nome: true, descricao: true },
                },
            },
            orderBy: { nome: "asc" },
            }),
        ]);

        const usuarios: Usuario[] = data.map((usuario) => ({
            ...usuario,
            status: usuario.status as StatusUsuarioTipo,
        }));

        return { total, itens: usuarios };
    }

    async listarUsuarioInfluencer(): Promise<Usuario[] | null> {
        const usuarios = await this.prisma.usuario.findMany({
            where: {
                perfis: {
                    some: {
                        nome: "INFLUENCER"
                    }
                }
            },
            include: {
                perfis: {
                    select: { id: true, nome: true, descricao: true }
                }
            },
            orderBy: {
                nome: "asc"
            }
        });

        if (!usuarios.length) return null;

        return usuarios.map(u => ({
            ...u,
            status: u.status as StatusUsuarioTipo
        }));
    }

    async recuperar(valor: number): Promise<Usuario | null> {
        const id = Number(valor)

        const usuario = await this.prisma.usuario.findUnique({
            where: { id },
            include: {
                perfis: {
                    select: { id: true, nome: true, descricao: true }
                },
                assinaturas: {
                include: {
                    plano: true,
                    usuario: true,
                }
            },
            }
        })

        if (!usuario) return null;

        return {
            ...usuario,
            status: usuario.status as StatusUsuarioTipo,
            assinaturas: usuario.assinaturas.map((a) => ({
                ...a,
                status: a.status as StatusAssinaturaTipo,
                pagamentoInfluencer: a.pagamentoInfluencer as PagamentoInfluencer,
                valor: Number(a.valor),
                valorPago: Number(a.valorPago),
                plano: {
                    ...a.plano,
                    valor: Number(a.plano.valor),
                },
                usuario: {
                    ...a.usuario,
                    status: a.usuario.status as StatusUsuarioTipo,
                },
            })),
        };
    }

    async excluir(valor: number): Promise<void> {
        const id = Number(valor)

        await this.prisma.usuario.delete({
          where: { id },
          include: { perfis: true },
        });
    }

    async salvar(usuario: Usuario): Promise<void> {
        try {
            const dadosUpdate: any = {
                nome: usuario.nome,
                email: usuario.email,
                cpf: usuario.cpf,
                telefone: usuario.telefone,
                status: usuario.status,
                perfis: {
                    set: usuario.perfis?.map((perfil) => ({ id: perfil.id })) || [],
                },
            };

            if (usuario.senha && usuario.senha.trim() !== "") {
                dadosUpdate.senha = usuario.senha;
            }

            if (usuario.id) {
            await this.prisma.usuario.upsert({
                where: { id: usuario.id },
                create: {
                    ...dadosUpdate,
                    senha: usuario.senha!,
                    perfis: {
                        connect: usuario.perfis?.map((perfil) => ({ id: perfil.id })) || [],
                    },
                },
                update: dadosUpdate,
            });
            } else {
            await this.prisma.usuario.create({
                data: {
                ...dadosUpdate,
                senha: usuario.senha!,
                perfis: {
                    connect: usuario.perfis?.map((perfil) => ({ id: perfil.id })),
                },
                },
            });
            }
        } catch (error: any) {
            if (error.code === "P2002") {
                const alvo = error.meta?.target;
                const alvoStr = Array.isArray(alvo) ? alvo.join(",") : String(alvo || "").toLowerCase();

                if (alvoStr.includes("cpf")) {
                    throw new ConflictException("CPF já cadastrado");
                }

                if (alvoStr.includes("email")) {
                    throw new ConflictException("E-mail já cadastrado");
                }
            }

            throw error;
        }
    }

    async recuperarUsuarioPorEmail(email: string): Promise<Usuario | null> {
        const usuario = await this.prisma.usuario.findFirst({
            where: { email },
            include: {
                perfis: {
                    select: { id: true, nome: true, descricao: true }
                }
            }
        })

        if (!usuario) return null;

        return {
            ...usuario,
            status: usuario.status as StatusUsuarioTipo
        };
    }

    async alterarSenha(novaSenha: string, idUsuario: number): Promise<string> {
        const id = Number(idUsuario)
        const usuarioAlterado = await this.prisma.usuario.update({
            where: { id },
            data: { senha: novaSenha },
        });

        return usuarioAlterado.email
    }
}
