import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update.dto';
import * as twilio from 'twilio';
import { parsePhoneNumberFromString } from 'libphonenumber-js';


@Injectable()
export class AuthService {
    private twilioClient: twilio.Twilio;
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService
    ) {
        const accountSid = process.env.TWILIO_ACCOUNT_SID!;
        const authToken = process.env.TWILIO_AUTH_TOKEN!;
        if (!accountSid || !authToken) {
            throw new Error('Twilio credentials are not set in environment variables.');
        }

        this.twilioClient = twilio(accountSid, authToken);
    }

    async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
        const { name, email, password, phoneNumber } = signUpDto;
        const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber);
        try {
            if (!formattedPhoneNumber) {
                throw new Error('Invalid phone number format.');
            }

            const existingUser = await this.userModel.findOne({ email });
            if (existingUser) {
                throw new Error('User with this email already exists.');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            await this.sendOtpToPhoneNumber(formattedPhoneNumber, otp);

            const user = await this.userModel.create({
                name,
                email,
                password: hashedPassword,
                phoneNumber: formattedPhoneNumber,
                otp,
            });

            const token = this.jwtService.sign({ id: user._id.toString() });

            return { token };
        } catch (e) {
            throw new Error('Failed to sign up user.');
        }
    }
    private formatPhoneNumber(phoneNumber: string): string | null {
        try {

            const phone = parsePhoneNumberFromString(phoneNumber, 'IN');
            if (phone) {
                return phone.format('E.164');
            }
        } catch (error) {
            console.error('Error formatting phone number:', error);
        }
        return null;
    }


    private async sendOtpToPhoneNumber(phoneNumber: string, otp: string): Promise<void> {
        const message = `Your OTP is ${otp}. Please use this to complete your sign-up process.`;

        try {
            await this.twilioClient.messages.create({
                body: message,
                messagingServiceSid: process.env.TWILIO_SERVICE_ID!,
                to: phoneNumber,
            });
            console.log(`OTP sent to ${phoneNumber}`);
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw new Error('Could not send OTP. Please try again later.');
        }
    }
    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto
        const user = await this.userModel.findOne({ email })

        try {
            if (!user) {
                throw new UnauthorizedException("Invalid Email")
            }
            const isMatched = await bcrypt.compare(password, user.password);

            if (!isMatched) {
                throw new UnauthorizedException('Password is mismatched');
            }
            const token = this.jwtService.sign({ id: user._id });
            return { token };

        } catch (e) {
            throw new Error('Failed to login user.');
        }
    }

    async getUser(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId).exec();

        try {
            if (!user) {
                throw new NotFoundException('User Not Found');
            }
            return user;
        } catch (e) {
            throw new Error("Invalid User")
        }
    }

    async getAllUsers(): Promise<User[]> {
        try {
            return this.userModel.find().select('-password').exec();
        } catch (e) {
            throw new Error("Invalid Users")
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
            throw new Error("Internal server error")
        }
    }

    async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userModel.findById(userId).exec();
        try {
            if (!user) {
                throw new NotFoundException(`User for this ${userId} is Not Found`);
            }

            const updatedUser = await this.userModel.findByIdAndUpdate(
                userId,
                updateUserDto,
                { new: true }
            ).exec();

            if (!updatedUser) {
                throw new NotFoundException(`User with ID ${userId} could not be updated`);
            }

            return updatedUser;
        } catch (e) {
            throw new Error('Internal server error')
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
            throw new Error("Internal server error")
        }
    }

    async unblockUser(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId).exec();
        try {
            if (!user) {
                throw new NotFoundException(`User for this ${userId} is Not Found`)

            }

            user.isBlocked = false;
            return user.save();
        } catch (e) {
            throw new Error("Internal Server Error")
        }
    }

}
