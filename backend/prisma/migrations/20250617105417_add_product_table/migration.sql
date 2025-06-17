/*
  Warnings:

  - You are about to drop the column `category` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the column `imageurl` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the column `supplier` on the `order_products` table. All the data in the column will be lost.
  - You are about to alter the column `productId` on the `order_products` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- CreateTable
CREATE TABLE "products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "hasdiscount" BOOLEAN NOT NULL,
    "discount" INTEGER NOT NULL,
    "imageurl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_order_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "hasdiscount" BOOLEAN NOT NULL,
    "discount" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "order_products_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_order_products" ("createdAt", "discount", "hasdiscount", "id", "name", "orderId", "priceInCents", "productId", "quantity", "updatedAt") SELECT "createdAt", "discount", "hasdiscount", "id", "name", "orderId", "priceInCents", "productId", "quantity", "updatedAt" FROM "order_products";
DROP TABLE "order_products";
ALTER TABLE "new_order_products" RENAME TO "order_products";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
