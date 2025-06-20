import { Module } from '@nestjs/common';
import { RepositoryUserService } from './user.service';
import { PrismaModule } from 'src/PrismaService/prisma.module';
import { RepositoryOrderService } from './order.service';
import { RepositoryProductService } from './product.service';

@Module({
  imports: [PrismaModule],
  providers: [RepositoryUserService, RepositoryOrderService, RepositoryProductService],
  exports: [RepositoryUserService, RepositoryOrderService, RepositoryProductService],
})
export class RepositoriesModule {}
