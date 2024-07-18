/*
  Warnings:

  - You are about to drop the column `vactionDays` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "vacationDays" INTEGER
);
INSERT INTO "new_User" ("email", "firstName", "id", "jobTitle", "lastName", "startDate", "tag") SELECT "email", "firstName", "id", "jobTitle", "lastName", "startDate", "tag" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
