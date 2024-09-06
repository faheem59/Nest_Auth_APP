import { Injectable, NotFoundException } from '@nestjs/common';
import { Chat } from './schemas/chat.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Model } from 'mongoose'
import { ChatCreateMessageDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<Chat>,
        @InjectModel(User.name) private userModel: Model<User>,

    ) { }

    async createMessage(id: string, chatCreateMessageDto: ChatCreateMessageDto) {
        const sender = await this.userModel.findById(id).exec();
        try {
            if (!sender) {
                throw new NotFoundException("Sender Not Found");
            }

            const newMessage = new this.chatModel({
                sender: id,
                message: chatCreateMessageDto.message
            });

            return newMessage.save();
        } catch (error) {
            throw new Error("Internal Server Error")
        }
    }

    async getMessage(): Promise<Chat[]> {
        try {
            return this.chatModel.find().populate('sender').sort({ timestamp: 1 }).exec();
        } catch (error) {
            throw new Error("Internal Server Error")

        }
    }


    async getSingleChat(chatId: string): Promise<Chat> {
        const chatMessage = await this.chatModel.findById(chatId).populate('sender').exec();
        try {
            if (!chatMessage) {
                throw new NotFoundException(`Chat message with id ${chatId} not found`);
            }
            return chatMessage;
        } catch (error) {
            throw new Error("Internal Server Error")

        }
    }

    async getUserChats(userId: string): Promise<Chat[]> {
        try {
            const userChats = await this.chatModel.find({ sender: userId }).populate('sender').sort({ timestamp: 1 }).exec();
            return userChats;
        } catch (error) {
            throw new Error("Internal Server Error")

        }
    }
}
