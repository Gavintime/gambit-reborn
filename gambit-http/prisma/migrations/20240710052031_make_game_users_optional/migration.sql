-- DropForeignKey
ALTER TABLE `Game` DROP FOREIGN KEY `Game_blackId_fkey`;

-- DropForeignKey
ALTER TABLE `Game` DROP FOREIGN KEY `Game_whiteId_fkey`;

-- AlterTable
ALTER TABLE `Game` MODIFY `whiteId` INTEGER UNSIGNED NULL,
    MODIFY `blackId` INTEGER UNSIGNED NULL;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_whiteId_fkey` FOREIGN KEY (`whiteId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_blackId_fkey` FOREIGN KEY (`blackId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
