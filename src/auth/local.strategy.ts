import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        });
    }

    async validate(
        request: Request,
        email: string,
        password: string,
    ): Promise<{
        studentId: string;
    }> {
        const student = await this.authService.findStudentByEmail(email);

        if (!student) {
            throw new UnauthorizedException(
                'User does not exist. Please try again with the email address you signed up previously',
            );
        }

        const isPasswordValid = await this.authService.validatePassword(password, student);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        return {
            studentId: student.studentId,
        };
    }
}
