
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    readonly name?: string;

    @IsOptional()
    @IsEmail()
    readonly email?: string;
}
