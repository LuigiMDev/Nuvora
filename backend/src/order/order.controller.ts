import { Body, Controller, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from 'src/DTOs/order';
import { Request } from 'express';

@Controller('order')
export class OrderController {
  constructor(private readonly service: OrderService) {}
  @Post('create')
  async createOrder(@Body() orderData: CreateOrderDTO, @Req() req: Request) {
    return await this.service.createOrder(orderData, req);
  }
}
