import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Admin } from './entity/admin.entity';
import { Connection, EntityManager } from 'typeorm';
import { generateAdminId } from 'src/common/helpers/random-generator.helper';
import { AdminCreateAdminDto } from './dto/admin-create-admin.dto';
import { AdminCreateAdminResponseDto } from './dto/admin-create-admin-response.dto';
import { generateSalt, hashPassword } from 'src/common/helpers/hash-password.helper';
import { AdminGetAdminsResponseDto } from './dto/admin-get-admins-responose.dto';
import { AdminRemoveAdminDto } from './dto/admin-remove-admin.dto';
import { ResponseMessageEnums } from 'src/response-handler/response.message.enum';

@Injectable()
export class AdminAdminsService {
    constructor(private connection: Connection) {}

    async getAdmins(
        skip: number,
        take: number,
        userId: string,
        username: string,
        sortKey: string,
        sortOrder: 'ASC' | 'DESC',
        entityManager?: EntityManager,
    ): Promise<AdminGetAdminsResponseDto> {
        const manager = entityManager || this.connection.manager;

        let query = manager.getRepository(Admin).createQueryBuilder('admin');

        if (userId) {
            query = query.andWhere('admin.userId LIKE :userId', { userId: '%' + userId + '%' });
        }

        if (username) {
            query = query.andWhere('admin.username LIKE :username', { username: '%' + username + '%' });
        }

        const formattedSortKey = sortKey ? 'admin.' + sortKey : 'admin.userId';
        const admins = await query
            .skip(skip || 0)
            .take(take || 50)
            .orderBy(formattedSortKey, sortOrder || 'DESC')
            .getMany();
        const count = await query.getCount();
        const dto = new AdminGetAdminsResponseDto();
        dto.admins = admins || [];
        dto.totalCount = count;
        return dto;
    }

    async getAdminById(userId: string, entityManager?: EntityManager): Promise<Admin> {
        const manager = entityManager || this.connection.manager;

        const admin = await manager
            .getRepository(Admin)
            .createQueryBuilder('admin')
            .where('admin.userId = :userId', { userId })
            .getOne();

        if (!admin) {
            throw new BadRequestException(ResponseMessageEnums.INVALID_ADMIN);
        }
        return admin;
    }

    async createAdmin(adminCreateAdminDto: AdminCreateAdminDto): Promise<AdminCreateAdminResponseDto> {
        const admin = new Admin();
        await this.connection.transaction(async (manager) => {
            const existingAdmin = await manager
                .getRepository(Admin)
                .createQueryBuilder('admin')
                .where('admin.username = :username', { username: adminCreateAdminDto.username })
                .getOne();
            if (existingAdmin) {
                throw new BadRequestException(ResponseMessageEnums.ADMIN_ALREADY_EXISTS);
            }

            const salt = await generateSalt();
            const userId = generateAdminId();

            admin.userId = userId;
            admin.name = adminCreateAdminDto.name;
            admin.username = adminCreateAdminDto.username;
            admin.password = await hashPassword(adminCreateAdminDto.password, salt);
            admin.salt = salt;
            await manager.save(admin);
        });

        const dto = new AdminCreateAdminResponseDto();
        dto.userId = admin.userId;
        dto.username = admin.username;
        return dto;
    }

    async resetMyPassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
        await this.connection.transaction(async (manager) => {
            const admin = await manager
                .getRepository(Admin)
                .createQueryBuilder('admin')
                .addSelect('admin.password')
                .addSelect('admin.salt')
                .where('admin.userId = :userId', { userId })
                .getOne();

            if (!admin) {
                throw new BadRequestException(ResponseMessageEnums.INVALID_ADMIN);
            }
            const hash = await hashPassword(oldPassword, admin.salt);
            if (admin.password !== hash) {
                throw new BadRequestException(ResponseMessageEnums.PASSWORD_MISMATCHING);
            }

            const salt = await generateSalt();
            admin.password = await hashPassword(newPassword, salt);
            admin.salt = salt;

            await manager.save(admin);
        });
    }

    async resetAdminPassword(userId: string, newPassword: string): Promise<void> {
        await this.connection.transaction(async (manager) => {
            const admin = await manager
                .getRepository(Admin)
                .createQueryBuilder('admin')
                .where('admin.userId = :userId', { userId })
                .getOne();

            if (!admin) {
                throw new BadRequestException(ResponseMessageEnums.INVALID_ADMIN);
            }

            const salt = await generateSalt();
            admin.password = await hashPassword(newPassword, salt);
            admin.salt = salt;

            await manager.save(admin);
        });
    }

    async removeAdmin(adminRemoveAdminDto: AdminRemoveAdminDto): Promise<void> {
        await this.connection.transaction(async (manager) => {
            const admin = await manager
                .getRepository(Admin)
                .createQueryBuilder('admin')
                .where('admin.userId = :userId', { userId: adminRemoveAdminDto.userId })
                .getOne();
            if (!admin) {
                throw new BadRequestException(ResponseMessageEnums.INVALID_ADMIN);
            }

            await manager
                .getRepository(Admin)
                .createQueryBuilder('admin')
                .delete()
                .from(Admin)
                .where('admin.userId = :userId', { userId: adminRemoveAdminDto.userId })
                .execute();
        });
    }
}
