import { Module } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { AdminJwtStrategy } from './admin-jwt.strategy';

@Module({
    providers: [AdminJwtStrategy, AdminAuthService],
    controllers: [AdminAuthController],
    imports: [
        JwtModule.register({
            secret: jwtConfig.secret,
            signOptions: { expiresIn: '2h' },
        }),
    ],
})
export class AdminAuthModule {}
