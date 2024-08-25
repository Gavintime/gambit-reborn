/*
  Warnings:

  - The primary key for the `Game` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Game` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.
  - You are about to alter the column `plyCount` on the `Game` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedSmallInt`.
  - You are about to alter the column `whiteId` on the `Game` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.
  - You are about to alter the column `blackId` on the `Game` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.

*/
-- DropForeignKey
ALTER TABLE `Game` DROP FOREIGN KEY `Game_blackId_fkey`;

-- DropForeignKey
ALTER TABLE `Game` DROP FOREIGN KEY `Game_whiteId_fkey`;

-- AlterTable
ALTER TABLE `Game` DROP PRIMARY KEY,
    MODIFY `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    MODIFY `plyCount` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    MODIFY `whiteId` INTEGER UNSIGNED NOT NULL,
    MODIFY `blackId` INTEGER UNSIGNED NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_whiteId_fkey` FOREIGN KEY (`whiteId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_blackId_fkey` FOREIGN KEY (`blackId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
