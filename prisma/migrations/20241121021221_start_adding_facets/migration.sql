/*
  Warnings:

  - A unique constraint covering the columns `[facet_id,code]` on the table `FacetValue` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Facet_code_key";

-- DropIndex
DROP INDEX "FacetValue_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "FacetValue_facet_id_code_key" ON "FacetValue"("facet_id", "code");
