/*
  Warnings:

  - You are about to drop the column `discount` on the `order_products` table. All the data in the column will be lost.
  - Added the required column `priceWithDiscountInCents` to the `order_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TotalPriceInCents` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Made the column `priceWithDiscountInCents` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_order_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "hasdiscount" BOOLEAN NOT NULL DEFAULT false,
    "discountInPercent" INTEGER,
    "priceWithDiscountInCents" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "order_products_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_order_products" ("createdAt", "hasdiscount", "id", "name", "orderId", "priceInCents", "productId", "quantity", "updatedAt") SELECT "createdAt", "hasdiscount", "id", "name", "orderId", "priceInCents", "productId", "quantity", "updatedAt" FROM "order_products";
DROP TABLE "order_products";
ALTER TABLE "new_order_products" RENAME TO "order_products";
CREATE TABLE "new_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "TotalPriceInCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_orders" ("createdAt", "id", "status", "updatedAt", "userId") SELECT "createdAt", "id", "status", "updatedAt", "userId" FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
CREATE TABLE "new_products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "hasdiscount" BOOLEAN NOT NULL DEFAULT false,
    "discountInPercent" INTEGER,
    "priceWithDiscountInCents" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_products" ("category", "createdAt", "description", "discountInPercent", "hasdiscount", "id", "material", "name", "priceInCents", "priceWithDiscountInCents", "supplier", "updatedAt") SELECT "category", "createdAt", "description", "discountInPercent", "hasdiscount", "id", "material", "name", "priceInCents", "priceWithDiscountInCents", "supplier", "updatedAt" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
