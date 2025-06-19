import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { CreateOrderDTO } from 'src/DTOs/order';
import { RepositoryOrderService } from 'src/repositories/order.service';
import { OrderResponse } from 'src/types/order';

@Injectable()
export class OrderService {
  constructor(
    private readonly repo: RepositoryOrderService,
    private readonly jwt: AuthService,
  ) {}
  async createOrder(
    orderData: CreateOrderDTO,
    req: Request,
  ): Promise<OrderResponse> {
    try {
      const token = req.cookies.token as string | undefined;
      if (!token) {
        throw new Error('Token não encontrado');
      }
      const { userId } = this.jwt.verifyToken(token);

      console.log(
        'Creating order with data:',
        orderData.products,
        'for user ID:',
        userId,
      );
      return await this.repo.createOrder(orderData, userId);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Token inválido ou expirado'
      ) {
        throw new BadRequestException('Token inválido ou expirado');
      }
      console.log('Error creating order:', error);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao criar o pedido',
      );
    }
  }

  async getOrders(req: Request): Promise<OrderResponse[]> {
    try {
      const token = req.cookies.token as string | undefined;
      if (!token) {
        throw new Error('Token não encontrado');
      }
      const { userId } = this.jwt.verifyToken(token);

      return await this.repo.getOrders(userId);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Token inválido ou expirado'
      ) {
        throw new BadRequestException('Token inválido ou expirado');
      }
      console.log('Error fetching orders:', error);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao buscar os pedidos',
      );
    }
  }
}
