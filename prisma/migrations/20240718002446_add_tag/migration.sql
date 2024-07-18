/*
  Warnings:

  - Added the required column `tag` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag` to the `Workspace` table without a default value. This is not possible if the table is not empty.

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
    "vactionDays" INTEGER
);
INSERT INTO "new_User" ("email", "firstName", "id", "jobTitle", "lastName", "startDate", "vactionDays") SELECT "email", "firstName", "id", "jobTitle", "lastName", "startDate", "vactionDays" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE TABLE "new_Workspace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "description" TEXT
);
INSERT INTO "new_Workspace" ("description", "id", "name") SELECT "description", "id", "name" FROM "Workspace";
DROP TABLE "Workspace";
ALTER TABLE "new_Workspace" RENAME TO "Workspace";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
