import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { ProductModule } from './product/product.module';
import { ShippingModule } from './shipping/shipping.module';
import { OrderModule } from './order/order.module';

@Module({

  imports: [AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    ChatModule,
    ProductModule,
    ShippingModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule { }
