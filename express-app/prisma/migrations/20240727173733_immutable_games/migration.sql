/*
  Warnings:

  - You are about to alter the column `result` on the `Game` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.
  - Made the column `finishedAt` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `whiteId` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `blackId` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `moves` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Game` DROP FOREIGN KEY `Game_blackId_fkey`;

-- DropForeignKey
ALTER TABLE `Game` DROP FOREIGN KEY `Game_whiteId_fkey`;

-- AlterTable
ALTER TABLE `Game` ALTER COLUMN `createdAt` DROP DEFAULT,
    MODIFY `finishedAt` DATETIME(3) NOT NULL,
    MODIFY `result` ENUM('WHITE_WON', 'BLACK_WON', 'TIE') NOT NULL,
    ALTER COLUMN `plyCount` DROP DEFAULT,
    MODIFY `whiteId` INTEGER UNSIGNED NOT NULL,
    MODIFY `blackId` INTEGER UNSIGNED NOT NULL,
    MODIFY `moves` TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_whiteId_fkey` FOREIGN KEY (`whiteId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_blackId_fkey` FOREIGN KEY (`blackId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
