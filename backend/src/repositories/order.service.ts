import { Injectable } from '@nestjs/common';
import { CreateOrderDTO } from 'src/DTOs/order';
import { PrismaService } from 'src/PrismaService/prisma.service';
import { OrderResponse } from 'src/types/order';

@Injectable()
export class RepositoryOrderService {
  constructor(private readonly prisma: PrismaService) {}
  async createOrder(
    orderData: CreateOrderDTO,
    userId: string,
  ): Promise<OrderResponse> {
    return await this.prisma.order.create({
      data: {
        userId: userId,
        orderProduct: {
          create: orderData.products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
        },
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        orderProduct: {
          select: {
            productId: true,
            quantity: true,
          },
        },
      },
    });
  }

  getOrder(orderId: string): string {
    // Here you would typically retrieve the order from a database
    return `Order details for ID: ${orderId}`;
  }
}
