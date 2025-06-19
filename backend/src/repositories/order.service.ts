import { Injectable } from '@nestjs/common';
import { CreateOrderDTO } from 'src/DTOs/order';
import { PrismaService } from 'src/PrismaService/prisma.service';
import { OrderResponse } from 'src/types/order';

type OrderProductData = {
  priceInCents: number;
  hasdiscount: boolean;
  discountInPercent: number | null;
  priceWithDiscountInCents: number;
  productId: number;
  quantity: number;
};

@Injectable()
export class RepositoryOrderService {
  constructor(private readonly prisma: PrismaService) {}
  async createOrder(
    orderData: CreateOrderDTO,
    userId: string,
  ): Promise<OrderResponse> {
    const productsIds = orderData.products.map((product) => product.productId);

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productsIds,
        },
      },
    });

    const orderProducts: OrderProductData[] = orderData.products.map((p) => {
      const product = products.find((prod) => prod.id === p.productId);
      if (!product) {
        throw new Error(`Produto com ID ${p.productId} não foi encontrado`);
      }

      return {
        productId: product.id,
        hasdiscount: product.hasdiscount,
        discountInPercent: product.discountInPercent,
        priceWithDiscountInCents: product.priceWithDiscountInCents,
        quantity: p.quantity,
        priceInCents: product.priceInCents,
      };
    });

    const totalPriceInCents = orderProducts.reduce(
      (total, product) =>
        total + product.priceWithDiscountInCents * product.quantity,
      0,
    );

    return await this.prisma.order.create({
      data: {
        userId: userId,
        totalPriceInCents,
        orderProduct: {
          create: orderProducts,
        },
      },
      select: {
        id: true,
        createdAt: true,
        totalPriceInCents: true,
        status: true,
        orderProduct: {
          select: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
            priceInCents: true,
            hasdiscount: true,
            discountInPercent: true,
            priceWithDiscountInCents: true,
            quantity: true,
          },
        },
      },
    });
  }

  async getOrders(userId: string) {
    return await this.prisma.order.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        createdAt: true,
        totalPriceInCents: true,
        status: true,
        orderProduct: {
          select: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
            priceInCents: true,
            hasdiscount: true,
            discountInPercent: true,
            priceWithDiscountInCents: true,
            quantity: true,
          },
        },
      },
    });
  }
}
