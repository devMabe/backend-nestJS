import { Module , NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {  LoggerMiddleware  } from './auth/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { FirebaseService } from './firebase/firebase.service';

@Module({
  imports: [AuthModule , ConfigModule.forRoot()],
  providers: [FirebaseService]
})
export class AppModule  implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
    .forRoutes({path:'*', method: RequestMethod.GET});
  }
}
