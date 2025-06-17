import { Module } from '@nestjs/common';
import { RepositoriesModule } from 'src/repositories/repositories.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [RepositoriesModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
