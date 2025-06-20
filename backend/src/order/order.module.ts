import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { RepositoriesModule } from 'src/repositories/repositories.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [RepositoriesModule, AuthModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
