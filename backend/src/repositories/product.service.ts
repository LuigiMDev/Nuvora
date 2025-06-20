import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/PrismaService/prisma.service';

@Injectable()
export class RepositoryProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts(): Promise<Product[]> {
    return this.prisma.product.findMany({
      include: { images: { select: { imageUrl: true } } },
    });
  }

  async getProductById(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          select: {
            imageUrl: true,
          },
        },
      },
    });
  }
}
