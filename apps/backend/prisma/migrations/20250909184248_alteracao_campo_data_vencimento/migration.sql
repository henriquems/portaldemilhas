/*
  Warnings:

  - You are about to drop the column `dataPagamento` on the `assinatura` table. All the data in the column will be lost.
  - You are about to drop the column `dataVencimento` on the `assinatura` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "assinatura" DROP COLUMN "dataPagamento",
DROP COLUMN "dataVencimento",
ADD COLUMN     "data_pagamento" TIMESTAMP(3),
ADD COLUMN     "data_vencimento" TIMESTAMP(3);
