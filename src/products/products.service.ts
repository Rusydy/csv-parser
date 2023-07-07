import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async createBatch(productDtos: CreateProductDto[]): Promise<Product[]> {
    const products: Product[] = productDtos.map((dto) => {
      const product = new Product();
      product.name = dto.name;
      product.description = dto.description;
      product.price = dto.price;
      product.quantity = dto.quantity;
      product.sku = dto.sku;
      return product;
    });

    return await this.productsRepository.save(products);
  }

  async create(createProductDto: CreateProductDto) {
    return await this.productsRepository.save(createProductDto);
  }

  async findAll() {
    return await this.productsRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product: ${updateProductDto.name}`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
