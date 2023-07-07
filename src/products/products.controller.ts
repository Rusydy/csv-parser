import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { parse } from 'csv-parse';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCSVFile(@UploadedFile() file: Express.Multer.File) {
    
    // Parse CSV file
    const csvData: any[] = await new Promise((resolve, reject) => {
      const parser = parse({ delimiter: ',' });
      const data: any[] = [];

      parser.on('readable', () => {
        let record;
        while ((record = parser.read())) {
          data.push(record);
        }
      });

      parser.on('error', (err) => {
        reject(err);
      });

      parser.on('end', () => {
        resolve(data);
      });

      parser.write(file.buffer);
      parser.end();
    });

    // Transform CSV data into CreateProductDto instances
    const productDtos: CreateProductDto[] = csvData.map((row) => {
      const [name, description, price, quantity, sku] = row;
      const productDto = new CreateProductDto();
      productDto.name = name;
      productDto.description = description;
      productDto.price = parseFloat(price);
      productDto.quantity = parseInt(quantity);
      productDto.sku = sku;
      return productDto;
    });

    // Batch insertion into the database
    const batchSize = 100;
    const totalRecords = productDtos.length;
    const totalBatches = Math.ceil(totalRecords / batchSize);

    for (let i = 0; i < totalBatches; i++) {
      const startIndex = i * batchSize;
      const endIndex = (i + 1) * batchSize;

      const batchDtos = productDtos.slice(startIndex, endIndex);

      // Call the createBatch method in the ProductsService
      await this.productsService.createBatch(batchDtos);
    }

    return { message: 'CSV file uploaded and processed successfully.' };
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
