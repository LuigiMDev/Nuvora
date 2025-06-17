/*
  Warnings:

  - You are about to drop the column `TotalPriceInCents` on the `orders` table. All the data in the column will be lost.
  - Added the required column `totalPriceInCents` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "totalPriceInCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_orders" ("createdAt", "id", "status", "updatedAt", "userId") SELECT "createdAt", "id", "status", "updatedAt", "userId" FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
