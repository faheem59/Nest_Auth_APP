import { IsEmail, IsString, MinLength, } from "class-validator";

export class LoginDto {

    @IsEmail({}, { message: "Please provide correct email" })
    email: string

    @IsString()
    @MinLength(6)
    password: string

}