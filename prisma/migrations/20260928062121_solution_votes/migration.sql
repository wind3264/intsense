/*
  Warnings:

  - You are about to drop the column `upvotes` on the `Solution` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "SolutionVote" (
    "userId" TEXT NOT NULL,
    "solutionId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "solutionId"),
    CONSTRAINT "SolutionVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SolutionVote_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Solution" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "problemId" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Solution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Solution_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Solution" ("body", "createdAt", "id", "problemId", "userId") SELECT "body", "createdAt", "id", "problemId", "userId" FROM "Solution";
DROP TABLE "Solution";
ALTER TABLE "new_Solution" RENAME TO "Solution";
CREATE INDEX "Solution_problemId_idx" ON "Solution"("problemId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "SolutionVote_solutionId_idx" ON "SolutionVote"("solutionId");
