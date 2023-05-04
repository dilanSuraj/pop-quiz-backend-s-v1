import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConfig } from '../config/jwt.config';
import { AuthService } from './auth.service';
import { LoginException } from 'src/common/exceptions/login.exception';
import { StudentStatus } from 'src/student/entity/student.interface';
import { ReqStudentInfo } from './interfaces/req-student-info.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: jwtConfig.secret,
        });
    }

    async validate(payload: any): Promise<ReqStudentInfo> {
        const student = payload?.sub ? await this.authService.findAuthDetails(payload.sub) : undefined;
        if (!student) {
            throw new UnauthorizedException();
        } else {
            if (student.status === StudentStatus.DEACTIVATED) {
                throw new LoginException('Account temporarily deactivated, Please contact support');
            }
        }
        return {
            studentId: payload?.sub,
            email: payload?.email,
        };
    }
}
