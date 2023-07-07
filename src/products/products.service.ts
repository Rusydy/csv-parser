import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Logger } from '../logger/logger.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @Inject(Logger) private readonly logger: Logger,
  ) {}

  async createBatch(productDtos: CreateProductDto[]): Promise<Product[]> {
    try {
      const products: Product[] = productDtos.map((dto) => {
        const product = new Product();
        product.name = dto.name;
        product.description = dto.description;
        product.price = dto.price;
        product.quantity = dto.quantity;
        product.sku = dto.sku;
        return product;
      });

      await this.productsRepository.save(products);
      this.logger.log(`Created ${products.length} products`);

      return products;
    } catch (err) {
      this.logger.error(err.message, err.stack);
      throw err;
    }
  }

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.productsRepository.save(createProductDto);
    } catch (err) {
      this.logger.error(err.message, err.stack);
      throw err;
    }
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
