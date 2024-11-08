import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  AddToCartDto,
  RemoveFromCartDto,
  UpdateCartQuantityDto,
} from './dto/cart.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
  @Public()
  @Post('/otp')
  async sendOtp(@Body() body: { phoneNumber: string }) {
    const { phoneNumber } = body;
    await this.authService.sendOtpToPhoneNumber(phoneNumber);
    return { message: 'OTP sent successfully' };
  }

  @Public()
  @Post('verify-otp')
  async verifyOtp(
    @Body('phoneNumber') phoneNumber: string,
    @Body('value') value: string,
  ) {
    await this.authService.verifyOtp(phoneNumber, value);
    return { message: 'OTP verified successfully' };
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
    return this.authService.getAllUsers();
  }

  @Post(':userId/cart')
  async addToCart(
    @Param('userId') userId: string,
    @Body() addToCartDto: AddToCartDto,
  ) {
    const user = await this.authService.addItemToCart(userId, addToCartDto);
    return user;
  }

  @Patch(':userId/cart/:productId')
  async updateCartQuantity(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body() updateCartQuantityDto: UpdateCartQuantityDto,
  ) {
    const updatedUser = await this.authService.updateCartQuantity(
      userId,
      productId,
      updateCartQuantityDto,
    );
    return updatedUser;
  }

  @Delete(':userId/cart')
  async removeFromCart(
    @Param('userId') userId: string,
    @Body() removeFromCartDto: RemoveFromCartDto,
  ) {
    const user = await this.authService.removeItemFromCart(
      userId,
      removeFromCartDto,
    );
    return user;
  }

  @Public()
  @Get('/:userId/cart')
  async getUserCart(@Param('userId') userId: string) {
    try {
      const cart = await this.authService.getCart(userId);
      return cart;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
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
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Patch('/:id/block')
  async blockUser(@Param('id') id: string): Promise<User> {
    try {
      return await this.authService.blockUser(id);
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
      return await this.authService.unblockUser(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('An erro occurred while blocking');
    }
  }
}
