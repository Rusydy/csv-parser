import { IsInt, Min, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  price: number;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsNotEmpty()
  sku: string;
}
