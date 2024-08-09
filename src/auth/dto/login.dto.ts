import { IsAlphanumeric, IsEmail, MinLength, } from "class-validator";

export class LoginDto {

    @IsEmail({}, { message: "Please provide correct email" })
    email: string

    @IsAlphanumeric()
    @MinLength(6)
    password: string

}