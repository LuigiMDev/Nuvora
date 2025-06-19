import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from 'src/DTOs/order';
import { Request } from 'express';

@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}
  @Post()
  async createOrder(@Body() orderData: CreateOrderDTO, @Req() req: Request) {
    return await this.service.createOrder(orderData, req);
  }

  @Get()
  async getOrders(@Req() req: Request) {
    return await this.service.getOrders(req)
  }
}
