import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CartItem, CartItemDocument } from './entities/cart-item.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from 'src/products/entities/product.entity';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from 'src/cart/entities/cart.entity';

@Injectable()
export class CartItemsService {

  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(CartItem.name) private readonly cartItemModel: Model<CartItemDocument>,
  ) { }

  async addProductToCart(cartId: string, productId: string, quantity: number): Promise<any> {
    try {
      const existingCart = await this.cartModel.findById(cartId);
      const existingProduct = await this.productModel.findById(productId);
  
      if (!existingProduct) {
        throw new NotFoundException('Product not found');
      }
  
      if (!existingCart) {
        throw new NotFoundException('Cart not found');
      }
      const existingCartItem = await this.cartItemModel.findOne({cartId, productId})
  
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
        await existingCartItem.save(); 
        return existingCartItem.toJSON();
      } else {
        const newCartItem = await this.cartItemModel.create({
          cartId: existingCart.id,
          productId: existingProduct.id,
          quantity: quantity,
        });
  
        return newCartItem.toJSON();
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getCartItems(): Promise<any> {
    try {
      const cartItems = await this.cartItemModel.find({})
        .populate({
          path: 'productId',
          select: '',
          options: { strictPopulate: false },
        }).exec();
      return cartItems;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async updateProductQuantity(cartId: string, productId: string, quantity: number): Promise<CartItem> {
    try {
      const existingCart = await this.cartModel.findById(cartId);
      const existingProduct = await this.productModel.findById(productId);
  
      if (!existingProduct) {
        throw new NotFoundException('Product not found');
      }
  
      if (!existingCart) {
        throw new NotFoundException('Cart not found');
      }
  
      const existingCartItem = await this.cartItemModel.findOne({ cartId, productId });
  
      if (existingCartItem) {
        existingCartItem.quantity -= quantity;
  
        if (existingCartItem.quantity <= 0) {

          const deletedCartItem = await this.cartItemModel.findOneAndDelete({ cartId, productId });
          return deletedCartItem.toJSON();

        } else {
          await existingCartItem.save();
          return existingCartItem.toJSON();
        }
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update product quantity in cart');
    }
  }
  


  async deleteProductFromCart(cartId: string, productId: string): Promise<CartItem> {
    try {
      const deletedCartItem = await this.cartItemModel.findOneAndDelete({ cartId, productId });
  
      if (!deletedCartItem) {
        throw new NotFoundException('CartItem not found');
      }
      return deletedCartItem.toJSON();
  
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
  

}
