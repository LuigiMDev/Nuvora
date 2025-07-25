import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDTO {
  @IsNotEmpty({ message: 'A lista de produtos é obrigatória' })
  @IsArray({ message: 'A lista de produtos deve ser um array' })
  @ValidateNested({
    each: true,
    message: 'Cada produto deve ser um objeto válido',
  })
  @Type(() => OrderProductDTO)
  products: OrderProductDTO[];
}

class OrderProductDTO {
  @IsNotEmpty({ message: 'O id do produto é obrigatório' })
  @IsInt({ message: 'O id do produto deve ser um número inteiro' })
  productId: number;

  @IsNotEmpty({ message: 'A quantidade é obrigatória' })
  @IsInt({ message: 'A quantidade deve ser um número inteiro' })
  @Min(1, { message: 'A quantidade deve ser no mínimo 1' })
  quantity: number;
}
