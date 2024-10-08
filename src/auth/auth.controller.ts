import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { Public } from './public.decorator';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Public()
    @Post('/signup')
    signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }

    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('/login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
    @Public()
    @Get('/users')
    async getAllUsers(): Promise<User[]> {
        return this.authService.getAllUsers()
    }

    @Get('/:id')
    async getUser(@Param('id') id: string, @Req() request: Request) {
        const user = await this.authService.getUser(id);
        return user;
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param('id') id: string): Promise<void> {
        await this.authService.deleteUser(id);
    }

    @Patch('/:id')
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<User> {
        return this.authService.updateUser(id, updateUserDto);
    }

    @Patch('/:id/block')
    async blockUser(@Param('id') id: string): Promise<User> {
        try {
            return await this.authService.blockUser(id)
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('An erro occurred while blocking');
        }
    }
    @Patch('/:id/unblock')
    async unblockUser(@Param('id') id: string): Promise<User> {
        try {
            return await this.authService.unblockUser(id)
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('An erro occurred while blocking');
        }
    }




}
