import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(error: any, student: any) {
        if (error || !student) {
            throw error || new UnauthorizedException();
        }
        return student;
    }
}
