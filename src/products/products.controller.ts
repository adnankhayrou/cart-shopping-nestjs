import {
  Controller,
  Post,
  Body,
  Res,
  Get,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Res() res, @Body() createProductDto: CreateProductDto) {
    const newProduct = await this.productService.create(createProductDto);
    return res.json({
      message: 'Product has been submitted successfully!',
      product: newProduct,
    });
  }

  @Get()
  async getProducts(@Res() res) {
    const products = await this.productService.getProducts();
    return res.json({
      products: products,
    });
  }
}
