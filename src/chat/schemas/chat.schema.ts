import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Schema as MongooseSchema } from "mongoose"

@Schema({
    timestamps: true
})
export class Chat {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    sender: MongooseSchema.Types.ObjectId;

    @Prop()
    message: string;

}

export const ChatSchema = SchemaFactory.createForClass(Chat) 
