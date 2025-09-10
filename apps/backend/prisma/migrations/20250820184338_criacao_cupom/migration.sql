-- AlterTable
ALTER TABLE "assinatura" ADD COLUMN     "cupom_id" INTEGER;

-- CreateTable
CREATE TABLE "cupom" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor_desconto" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "cupom_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assinatura" ADD CONSTRAINT "assinatura_cupom_id_fkey" FOREIGN KEY ("cupom_id") REFERENCES "cupom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cupom" ADD CONSTRAINT "cupom_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
