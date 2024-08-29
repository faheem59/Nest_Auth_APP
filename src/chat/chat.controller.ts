import { Body, Controller, Get, Param, Post, Req, UnauthorizedException } from '@nestjs/common';
import { ChatCreateMessageDto } from './dto/chat.dto';
import { ChatService } from './chat.service';
import { Request } from 'express';
import { Chat } from './schemas/chat.schema';


@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) { }

    @Post('/create')
    createMessage(@Req() req: Request, @Body() chatCreateMessageDto: ChatCreateMessageDto) {
        const id = req?.user?.id
        if (!id) {
            throw new UnauthorizedException("User Not Found")
        }
        return this.chatService.createMessage(id, chatCreateMessageDto);
    }
    @Get('messages')
    async getMessage(): Promise<Chat[]> {
        return this.chatService.getMessage();
    }
    @Get('message/:chatId')
    async getSingleChat(@Param('chatId') chatId: string): Promise<Chat> {
        return this.chatService.getSingleChat(chatId);
    }

    @Get('user/:userId')
    async getUserChats(@Param('userId') userId: string): Promise<Chat[]> {
        return this.chatService.getUserChats(userId);
    }


}
