import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RepositoryProductService } from 'src/repositories/product.service';

@Injectable()
export class ProductService {
  constructor(private readonly repo: RepositoryProductService) {}

  async getProducts() {
    try {
      return await this.repo.getProducts();
    } catch (error) {
      console.log('Ocorreu um erro ao buscar os produtos', error);
      throw new InternalServerErrorException('Erro ao buscar produtos');
    }
  }

  async getProductById(id: number) {
    try {
      return await this.repo.getProductById(id);
    } catch (error) {
      console.log('Ocorreu um erro ao buscar o produto', error);
      throw new InternalServerErrorException('Erro ao buscar produto');
    }
  }
}
