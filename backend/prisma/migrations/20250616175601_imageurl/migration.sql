/*
  Warnings:

  - Made the column `imageurl` on table `order_products` required. This step will fail if there are existing NULL values in that column.

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
    "imageurl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "hasdiscount" BOOLEAN NOT NULL,
    "discount" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "order_products_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_order_products" ("category", "createdAt", "description", "discount", "hasdiscount", "id", "imageurl", "material", "name", "orderId", "priceInCents", "productId", "quantity", "supplier", "updatedAt") SELECT "category", "createdAt", "description", "discount", "hasdiscount", "id", "imageurl", "material", "name", "orderId", "priceInCents", "productId", "quantity", "supplier", "updatedAt" FROM "order_products";
DROP TABLE "order_products";
ALTER TABLE "new_order_products" RENAME TO "order_products";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
