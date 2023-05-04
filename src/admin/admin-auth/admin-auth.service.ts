import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminLoginResponseDto } from './dto/admin-login-response.dto';
import { UserType } from 'src/users/user-type.enum';
import { Connection } from 'typeorm';
import { Admin } from '../admin-admins/entity/admin.entity';
import { hashPassword } from 'src/common/helpers/hash-password.helper';

@Injectable()
export class AdminAuthService {
    constructor(private connection: Connection, private jwtService: JwtService) {}

    async login(username: string, password: string): Promise<AdminLoginResponseDto> {
        const admin = await this.connection.manager
            .getRepository(Admin)
            .createQueryBuilder('admin')
            .addSelect('admin.password')
            .addSelect('admin.salt')
            .where('admin.username = :username', { username })
            .getOne();
        if (!admin) {
            throw new UnauthorizedException();
        }

        const hash = await hashPassword(password, admin.salt);
        if (admin.password !== hash) {
            throw new UnauthorizedException();
        }

        const jwtPayload = { sub: admin.userId, type: UserType.ADMIN };

        const dto = new AdminLoginResponseDto();
        dto.token = this.jwtService.sign(jwtPayload);
        dto.userId = admin.userId;
        dto.username = admin.username;
        return dto;
    }
}
