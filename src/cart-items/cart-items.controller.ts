import { Controller, Post, Body, Patch, Param, Delete, Get, Put } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';

@Controller('api/cartItems')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  async addProductToCart(@Body() cartDto: { cartId: string; productId: string; quantity: number }) {
    const cart = await this.cartItemsService.addProductToCart(cartDto.cartId, cartDto.productId, cartDto.quantity);
    return { message: 'Product added to cart successfully', cart };
  }

  @Get()
  async getCartItems() {
    const cartItems = await this.cartItemsService.getCartItems();
    return { message: 'Product added to cart successfully', cartItems };
  }

  @Put()
  async updateProductQuantity(@Body() updateDto: { cartId: string; productId: string; quantity: number }) {
    const { cartId, productId, quantity } = updateDto;
    const cartItem = await this.cartItemsService.updateProductQuantity(cartId, productId, quantity);
    return { message: 'Product quantity updated in cart successfully', cartItem };
  }

  @Delete(':cartId/:productId')
  async deleteProductFromCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ) {
    await this.cartItemsService.deleteProductFromCart(cartId, productId);
    return { message: 'The product has been successfully deleted from the shopping cart' };
  }

  
}
