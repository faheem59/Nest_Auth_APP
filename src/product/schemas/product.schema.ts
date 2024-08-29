import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';

@Schema({
    timestamps: true,
})
export class Product extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, maxLength: 8 })
    price: number;

    @Prop({ default: 0 })
    ratings: number;

    @Prop({
        type: [
            {
                public_id: { type: String, required: true },
                url: { type: String, required: true },
            },
        ],
    })
    images: { public_id: string; url: string }[];

    @Prop({ required: true })
    category: string;

    @Prop({ required: true, default: 1, maxLength: 4 })
    stock: number;

    @Prop({ default: 0 })
    numOfReviews: number;

    @Prop({
        type: [
            {
                name: { type: String, required: true },
                rating: { type: Number, required: true },
                comment: { type: String, required: true },
            },
        ],
    })
    reviews: { name: string; rating: number; comment: string }[];

    @Prop({ type: MongooseSchema.Types.Mixed, ref: 'User', required: true })
    user: ObjectId;

    @Prop({ default: Date.now })
    createAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
