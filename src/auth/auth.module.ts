import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { jwtConfig } from '../config/jwt.config';
import { StudentModule } from 'src/student/student.module';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
    ],
    imports: [
        StudentModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConfig.secret,
        }),
    ],
    exports: [AuthService],
})
export class AuthModule {}
