-- CreateTable
CREATE TABLE "estado" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cidade" (
    "id" SERIAL NOT NULL,
    "estado_id" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "cidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endereco" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "cidade_id" INTEGER NOT NULL,
    "logradouro" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "cep" TEXT NOT NULL,

    CONSTRAINT "endereco_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cidade" ADD CONSTRAINT "cidade_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_cidade_id_fkey" FOREIGN KEY ("cidade_id") REFERENCES "cidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
