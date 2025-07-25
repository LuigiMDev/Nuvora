/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type BrazilianProductFormated = {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  imagem: string;
  preco: string;
  material: string;
  departamento: string;
};
type EuropeanProductData = {
  id: string;
  name: string;
  description: string;
  hasDiscount: string;
  gallery: string[];
  price: string;
  discountValue: string;
  details: { adjective: string; material: string };
};

async function main() {
  const [brazilianProducts, europeanProducts] = await Promise.all([
    fetch(
      'https://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider',
    ),
    fetch(
      'https://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider',
    ),
  ]);

  if (!brazilianProducts.ok) {
    throw new Error('Failed to fetch Brazilian products');
  }

  const brazilianProductsData = (await brazilianProducts.json()) as any[];

  const brazilianProductsFormated: BrazilianProductFormated[] = [];

  function formatProducts(obj: any) {
    if (Array.isArray(obj)) {
      obj.forEach(formatProducts);
    } else if (obj && typeof obj === 'object') {
      if ('nome' in obj) {
        const onlyProperties = Object.fromEntries(
          Object.entries(obj).filter(([key]) => isNaN(Number(key))),
        ) as BrazilianProductFormated;
        brazilianProductsFormated.push(onlyProperties);
      }
      Object.values(obj).forEach(formatProducts);
    }
  }

  formatProducts(brazilianProductsData);

  if (!europeanProducts.ok) {
    throw new Error('Failed to fetch European products');
  }
  const europeanProductsData =
    (await europeanProducts.json()) as EuropeanProductData[];

  for (const product of brazilianProductsFormated) {
    const brazilianIntegerPrice = Math.round(parseFloat(product.preco) * 100);

    await prisma.product.create({
      data: {
        name: product.nome,
        description: product.descricao,
        priceInCents: brazilianIntegerPrice,
        priceWithDiscountInCents: brazilianIntegerPrice,
        images: {
          create: {
            imageUrl: product.imagem,
          },
        },
        category: product.categoria,
        material: product.material,
        supplier: 'BRAZILIAN',
      },
    });
  }

  for (const product of europeanProductsData) {
    const europeanIntegerPrice = Math.round(parseFloat(product.price) * 100);
    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        priceInCents: europeanIntegerPrice,
        hasdiscount: product.hasDiscount === 'true',
        discountInPercent: product.discountValue
          ? Math.round(parseFloat(product.discountValue) * 100)
          : null,
        priceWithDiscountInCents:
          product.hasDiscount === 'true'
            ? product.discountValue
              ? Math.round(
                  europeanIntegerPrice *
                    (1 - parseFloat(product.discountValue)),
                )
              : europeanIntegerPrice
            : europeanIntegerPrice,
        images: {
          create: product.gallery.map((imageUrl: string) => ({
            imageUrl,
          })),
        },
        category: product.details.adjective,
        material: product.details.material,
        supplier: 'EUROPEAN',
      },
    });
  }
}

main()
  .then(async () => {
    console.log('Seeding completed successfully');
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Error during seeding:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
