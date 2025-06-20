import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  async getProducts() {
    return this.service.getProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('ID inválido fornecido');
    }
    return this.service.getProductById(productId);
  }
}
