import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { ChatCreateMessageDto } from './dto/chat.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(ChatGateway.name);

    @WebSocketServer()
    server: Server;
    constructor(private readonly chatService: ChatService) { }

    afterInit(server: any) {
        this.logger.log('WebSocket gateway initialized');
    }

    handleConnection(client: any, ...args: any[]) {
        this.logger.log('Client connected');
    }

    handleDisconnect(client: any) {
        this.logger.log('Client disconnected');
    }

    @SubscribeMessage('message')
    async handleMessage(@MessageBody() id: string, chatCreateMeassageDto: ChatCreateMessageDto): Promise<void> {

        const newMessage = await this.chatService.createMessage(id, chatCreateMeassageDto);
        this.server.emit('message', newMessage);
    }
}
