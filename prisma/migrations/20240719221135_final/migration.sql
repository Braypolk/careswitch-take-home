-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "vacationDays" INTEGER
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "WorkspacesOnUsers" (
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "workspaceId"),
    CONSTRAINT "WorkspacesOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WorkspacesOnUsers_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
