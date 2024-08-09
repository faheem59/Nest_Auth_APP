import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.shema';
import { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';


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

}
