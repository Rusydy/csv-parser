import { Product } from '../entities/product.entity';
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCTS_REPOSITORY')
    private productsRepository: Repository<Product>,
  ) {}

  async create(product: Product): Promise<Product> {
    return await this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    return await this.productsRepository.findOne({ where: { id } });
  }

  async update(id: number, product: Product): Promise<Product> {
    await this.productsRepository.update(id, product);
    return await this.productsRepository.findOne({ where: { id } });
  }
}
