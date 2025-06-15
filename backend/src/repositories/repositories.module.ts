import { Module } from '@nestjs/common';
import { RepositoryUserService } from './user.service';
import { PrismaModule } from 'src/PrismaService/prisma.module';
import { RepositoryOrderService } from './order.service';

@Module({
  imports: [PrismaModule],
  providers: [RepositoryUserService, RepositoryOrderService],
  exports: [RepositoryUserService, RepositoryOrderService],
})
export class RepositoriesModule {}
