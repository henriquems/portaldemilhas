-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfil" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programa" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "companhia" TEXT NOT NULL,

    CONSTRAINT "programa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anuncio" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "programa_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "quantidade_milhas" INTEGER NOT NULL,
    "valor" DECIMAL(10,2),
    "tipo" TEXT NOT NULL,

    CONSTRAINT "anuncio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plano" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "dias" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "plano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assinatura" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "plano_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "data" TIMESTAMP(3) NOT NULL,
    "dataVencimento" TIMESTAMP(3),

    CONSTRAINT "assinatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PerfilToUsuario" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PerfilToUsuario_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_cpf_key" ON "usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "perfil_nome_key" ON "perfil"("nome");

-- CreateIndex
CREATE INDEX "_PerfilToUsuario_B_index" ON "_PerfilToUsuario"("B");

-- AddForeignKey
ALTER TABLE "anuncio" ADD CONSTRAINT "anuncio_programa_id_fkey" FOREIGN KEY ("programa_id") REFERENCES "programa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anuncio" ADD CONSTRAINT "anuncio_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assinatura" ADD CONSTRAINT "assinatura_plano_id_fkey" FOREIGN KEY ("plano_id") REFERENCES "plano"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assinatura" ADD CONSTRAINT "assinatura_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PerfilToUsuario" ADD CONSTRAINT "_PerfilToUsuario_A_fkey" FOREIGN KEY ("A") REFERENCES "perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PerfilToUsuario" ADD CONSTRAINT "_PerfilToUsuario_B_fkey" FOREIGN KEY ("B") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
