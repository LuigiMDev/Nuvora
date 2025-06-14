import { Module } from '@nestjs/common';
import { RepositoryUserService } from './user.service';
import { PrismaModule } from 'src/PrismaService/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RepositoryUserService],
  exports: [RepositoryUserService],
})
export class RepositoriesModule {}
