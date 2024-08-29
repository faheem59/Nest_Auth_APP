import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update.dto';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
        const { name, email, password } = signUpDto

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.userModel.create({
            name,
            email,
            password: hashedPassword
        })
        const token = this.jwtService.sign({ id: user._id });
        await user.save();

        return { token };
    }

    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto
        const user = await this.userModel.findOne({ email })

        if (!user) {
            throw new UnauthorizedException("Invalid Email")
        }
        const isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) {
            throw new UnauthorizedException('Password is mismatched');
        }
        const token = this.jwtService.sign({ id: user._id });
        return { token };
    }

    async getUser(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId).exec();

        if (!user) {
            throw new NotFoundException('User Not Found');
        }
        return user;
    }

    async getAllUsers(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async deleteUser(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new NotFoundException(`User for this ${userId} is Not Found`);
        }

        await this.userModel.findByIdAndDelete(userId).exec();

        return user;
    }

    async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userModel.findById(userId).exec();
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
    }

    async blockUser(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new NotFoundException(`User for this ${userId} is Not Found`);
        }

        user.isBlocked = true;
        return user.save();
    }

    async unblockUser(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new NotFoundException(`User for this ${userId} is Not Found`)

        }

        user.isBlocked = false;
        return user.save();
    }



}
