-- AlterTable
ALTER TABLE "cleaner" ADD COLUMN     "adminId" INTEGER;

-- AddForeignKey
ALTER TABLE "cleaner" ADD CONSTRAINT "cleaner_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
