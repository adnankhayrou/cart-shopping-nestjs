import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Cart {
}

export type CartDocument = Cart & Document;
export const CartSchema = SchemaFactory.createForClass(Cart);