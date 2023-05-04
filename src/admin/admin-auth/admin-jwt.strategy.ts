import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { jwtConfig } from '../../config/jwt.config';
import { UserType } from 'src/users/user-type.enum';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConfig.secret,
        });
    }

    async validate(payload: any): Promise<{ userId: string; type: UserType; }> {
        return {
            userId: payload.sub,
            type: payload.type,
        };
    }
}
