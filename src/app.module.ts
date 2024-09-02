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
import { ThrottlerModule } from '@nestjs/throttler';
import { PaymentModule } from './payment/payment.module';

@Module({

  imports: [AuthModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    ChatModule,
    ProductModule,
    ShippingModule,
    OrderModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule { }
