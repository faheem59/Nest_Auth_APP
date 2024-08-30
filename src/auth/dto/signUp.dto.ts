import { IsEmail, IsNotEmpty, IsString, MinLength, } from "class-validator";

export class SignUpDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsEmail({}, { message: "Please provide correct email" })
    email: string

    @IsString()
    @MinLength(6)
    password: string

    @IsString()
    phoneNumber: string

}