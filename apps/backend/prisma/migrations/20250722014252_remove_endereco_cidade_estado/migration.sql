/*
  Warnings:

  - You are about to drop the `cidade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `endereco` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `estado` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cidade" DROP CONSTRAINT "cidade_estado_id_fkey";

-- DropForeignKey
ALTER TABLE "endereco" DROP CONSTRAINT "endereco_cidade_id_fkey";

-- DropForeignKey
ALTER TABLE "endereco" DROP CONSTRAINT "endereco_usuario_id_fkey";

-- DropTable
DROP TABLE "cidade";

-- DropTable
DROP TABLE "endereco";

-- DropTable
DROP TABLE "estado";
