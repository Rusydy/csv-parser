import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should save a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        description: 'Product 1 description',
        price: 10.99,
        quantity: 5,
        sku: 'SKU001',
      };

      const savedProduct: Product = { id: 1, ...createProductDto };

      const saveSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(savedProduct);

      const result = await service.create(createProductDto);

      expect(saveSpy).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(savedProduct);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products: Product[] = [
        {
          id: 1,
          name: 'Product 1',
          description: 'Product 1 description',
          price: 10.99,
          quantity: 5,
          sku: 'SKU001',
        },
        {
          id: 2,
          name: 'Product 2',
          description: 'Product 2 description',
          price: 19.99,
          quantity: 8,
          sku: 'SKU002',
        },
      ];

      const findSpy = jest
        .spyOn(repository, 'find')
        .mockResolvedValue(products);

      const result = await service.findAll();

      expect(findSpy).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });

  describe('createBatch', () => {
    it('should save an array of products', async () => {
      const productDtos: CreateProductDto[] = [
        {
          name: 'Product 1',
          description: 'Product 1 description',
          price: 10.99,
          quantity: 5,
          sku: 'SKU001',
        },
        {
          name: 'Product 2',
          description: 'Product 2 description',
          price: 19.99,
          quantity: 8,
          sku: 'SKU002',
        },
      ];

      const savedProducts: Product[] = [
        { id: 1, ...productDtos[0] },
        { id: 2, ...productDtos[1] },
      ];

      for (let i = 0; i < productDtos.length; i++) {
        jest.spyOn(repository, 'save').mockResolvedValueOnce(savedProducts[i]);
      }

      const result = await service.createBatch(productDtos);

      expect(result).toEqual(productDtos);

      jest.clearAllMocks();
    });
  });
});
