/*
  Warnings:

  - Added the required column `category` to the `order_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `order_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount` to the `order_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasdiscount` to the `order_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material` to the `order_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `order_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceInCents` to the `order_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplier` to the `order_products` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_order_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "imageurl" TEXT,
    "category" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "hasdiscount" BOOLEAN NOT NULL,
    "discount" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "order_products_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_order_products" ("createdAt", "id", "orderId", "productId", "quantity", "updatedAt") SELECT "createdAt", "id", "orderId", "productId", "quantity", "updatedAt" FROM "order_products";
DROP TABLE "order_products";
ALTER TABLE "new_order_products" RENAME TO "order_products";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
