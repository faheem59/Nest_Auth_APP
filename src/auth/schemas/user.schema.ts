import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"


@Schema({
    timestamps: true
})
export class User {

    @Prop()
    name: string

    @Prop({ unique: [true, 'Duplicate email entered'] })
    email: string

    @Prop()
    password: string

    @Prop({ default: 'user' })
    role: string

    @Prop({ default: false })
    isBlocked: boolean

    @Prop()
    phoneNumber: string


    @Prop()
    resetPasswordToken: string

    @Prop()
    resetPasswordExpire: Date

}



export const UserSchema = SchemaFactory.createForClass(User) 
