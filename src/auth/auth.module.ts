import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, 
    JwtModule.register({
      secret: "myStrongSecret+askdlkajsdlk",
      signOptions: {expiresIn: '60s'}
    })
  
  ],
  controllers: [AuthController],
  providers: [AuthService, FirebaseService],
})
export class AuthModule {}
