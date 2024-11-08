import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, ObjectId } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update.dto';
import * as twilio from 'twilio';
import { Otp } from './schemas/otp.schema';
import { UserResponse } from '../auth/types/user.interface';
import {
  AddToCartDto,
  RemoveFromCartDto,
  UpdateCartQuantityDto,
} from './dto/cart.dto';
// import { plainToClass } from 'class-transformer';
@Injectable()
export class AuthService {
  private twilioClient: twilio.Twilio;
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Otp.name)
    private otpModel: Model<Otp>,
    private jwtService: JwtService,
  ) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID!;
    const authToken = process.env.TWILIO_AUTH_TOKEN!;
    if (!accountSid || !authToken) {
      throw new Error(
        'Twilio credentials are not set in environment variables.',
      );
    }

    this.twilioClient = twilio(accountSid, authToken);
  }

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password, phoneNumber } = signUpDto;
    console.log(name, email, password, phoneNumber, 'ggg');
    try {
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new Error('User with this email already exists.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Check if the phone number is verified
      const otpRecord = await this.otpModel.findOne({
        phoneNumber,
        isVerified: true,
      });
      if (!otpRecord) {
        throw new BadRequestException('Phone number is not verified.');
      }

      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
      });

      const token = this.jwtService.sign({ id: user._id.toString() });

      return { token };
    } catch (e) {
      console.error(e); // Log the error for debugging
      throw new Error('Failed to sign up user: ' + e.message);
    }
  }

  // private formatPhoneNumber(phoneNumber: string): string | null {
  //   try {
  //     const phone = parsePhoneNumberFromString(phoneNumber, 'IN');
  //     if (phone) {
  //       return phone.format('E.164');
  //     }
  //   } catch (error) {
  //     console.error('Error formatting phone number:', error);
  //   }
  //   return null;
  // }

  async sendOtpToPhoneNumber(phoneNumber: string): Promise<void> {
    console.log(
      'Phone number received:',
      phoneNumber,
      'Type:',
      typeof phoneNumber,
    );

    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Sending OTP ${otpValue} to ${phoneNumber}`);

    try {
      // Create a new OTP record in the database
      await this.otpModel.create({
        phoneNumber: phoneNumber, // Ensure this is a string
        value: otpValue,
        isVerified: false,
      });
    } catch (error) {
      console.error('Error saving OTP:', error);
      throw new Error('Could not save OTP. Please try again later.');
    }
  }

  async verifyOtp(phoneNumber: string, value: string): Promise<void> {
    const otpRecord = await this.otpModel.findOne({ phoneNumber, value });

    console.log(otpRecord, 'OTP Record');

    if (!otpRecord) {
      throw new Error('Invalid OTP or phone number.');
    }

    // Check if the OTP is already verified
    if (otpRecord.isVerified) {
      throw new Error('OTP has already been verified.');
    }

    // Mark OTP as verified
    otpRecord.isVerified = true;
    await otpRecord.save();

    console.log(`OTP verified for ${phoneNumber}`);
  }

  async login(loginDto: LoginDto): Promise<UserResponse> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid Email');
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw new UnauthorizedException('Password is mismatched');
    }

    const token = this.jwtService.sign({ id: user._id });

    // Create the UserResponse object
    const userResponse: UserResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.password,
      token,
    };

    return userResponse;
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();

    try {
      if (!user) {
        throw new NotFoundException('User Not Found');
      }
      return user;
    } catch (e) {
      throw new Error('Invalid User');
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return this.userModel.find().select('-password').exec();
    } catch (e) {
      throw new Error('Invalid Users');
    }
  }

  async deleteUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    try {
      if (!user) {
        throw new NotFoundException(`User for this ${userId} is Not Found`);
      }

      await this.userModel.findByIdAndDelete(userId).exec();

      return user;
    } catch (e) {
      throw new Error('Internal server error');
    }
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    try {
      if (!user) {
        throw new NotFoundException(`User for this ${userId} is Not Found`);
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(userId, updateUserDto, { new: true })
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(
          `User with ID ${userId} could not be updated`,
        );
      }

      return updatedUser;
    } catch (e) {
      throw new Error('Internal server error');
    }
  }

  async blockUser(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException(`User for this ${userId} is Not Found`);
      }

      user.isBlocked = true;
      return user.save();
    } catch (e) {
      throw new Error('Internal server error');
    }
  }

  async unblockUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    try {
      if (!user) {
        throw new NotFoundException(`User for this ${userId} is Not Found`);
      }

      user.isBlocked = false;
      return user.save();
    } catch (e) {
      throw new Error('Internal Server Error');
    }
  }

  async addItemToCart(
    userId: string,
    addToCartDto: AddToCartDto,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the product is already in the cart
    const existingProductIndex = user.cart.findIndex(
      (item) => item.productId.toString() === addToCartDto.productId.toString(),
    );

    if (existingProductIndex > -1) {
      // If the product is already in the cart, update the quantity
      user.cart[existingProductIndex].quantity += addToCartDto.quantity;
    } else {
      // If the product is not in the cart, add a new entry with the specified quantity
      user.cart.push({
        productId: addToCartDto.productId as unknown as ObjectId,
        quantity: addToCartDto.quantity || 1, // Default to 1 if quantity is not provided
      });
    }

    // Save the updated user object with the updated cart
    await user.save();

    return user;
  }

  async removeItemFromCart(
    userId: string,
    removeFromCartDto: RemoveFromCartDto,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Filter out the product by productId (ignoring quantity)
    const initialCartLength = user.cart.length;
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== removeFromCartDto.productId, // Match productId only
    );

    // If the cart length didn't change, the item wasn't found
    if (user.cart.length === initialCartLength) {
      throw new NotFoundException('Product not found in the cart');
    }

    await user.save();
    return user;
  }

  async getCart(userId: string) {
    const user = await this.userModel.findById(userId).populate({
      path: 'cart.productId', // This tells Mongoose to populate the `productId` field in each cart item
      model: 'Product', // Specify the model for `productId`
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    console.log(user, 'populated user with cart products');

    // After population, `user.cart` will contain product details instead of just product IDs
    return user.cart;
  }

  async updateCartQuantity(
    userId: string,
    productId: string,
    updateCartQuantityDto: UpdateCartQuantityDto,
  ): Promise<User> {
    // Find the user
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find the cart item by productId
    const cartItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId,
    );

    // If the product is not found in the cart
    if (cartItemIndex === -1) {
      throw new NotFoundException('Product not found in the cart');
    }

    // Update the quantity of the item
    user.cart[cartItemIndex].quantity = updateCartQuantityDto.quantity;

    // Save the updated user data
    await user.save();
    return user;
  }
}
