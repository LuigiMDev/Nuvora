import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
@Module({
  imports: [UserModule, OrderModule, ProductModule],
})
export class AppModule {}
