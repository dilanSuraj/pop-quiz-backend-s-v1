import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserType } from 'src/users/user-type.enum';

@Injectable()
export class AdminJwtAuthGuard extends AuthGuard('admin-jwt') {
    handleRequest(error: any, user: any) {
        const isAdmin = user.type === UserType.ADMIN;
        if (error || !user || !isAdmin) {
            throw error || new UnauthorizedException();
        }
        return user;
    }
}
