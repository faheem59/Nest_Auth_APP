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
        console.log(sender, "dkf")

        if (!sender) {
            throw new NotFoundException("Sender Not Found");
        }

        const newMessage = new this.chatModel({
            sender: id,
            message: chatCreateMessageDto.message
        });

        return newMessage.save();
    }

    async getMessage(): Promise<Chat[]> {
        return this.chatModel.find().populate('sender').sort({ timestamp: 1 }).exec();
    }


    async getSingleChat(chatId: string): Promise<Chat> {
        const chatMessage = await this.chatModel.findById(chatId).populate('sender').exec();
        if (!chatMessage) {
            throw new NotFoundException(`Chat message with id ${chatId} not found`);
        }
        return chatMessage;
    }

    async getUserChats(userId: string): Promise<Chat[]> {
        const userChats = await this.chatModel.find({ sender: userId }).populate('sender').sort({ timestamp: 1 }).exec();
        return userChats;
    }
}
