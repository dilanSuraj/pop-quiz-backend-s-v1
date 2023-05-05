import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Connection, EntityManager, In } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Enrollment } from 'src/enrollments/entity/enrollments.entity';
import { ResponseMessageEnums } from 'src/response-handler/response.message.enum';
import { EnrollmentStatus } from 'src/enrollments/enrollment-status.enum';
import { AdminGetAllEnrollmentsResponseDto } from './dto/admin-get-all-enrollments-response.dto';
import { AdminUpdateEnrollmentDto } from './dto/admin-update-enrollment.dto';

@Injectable()
export class AdminEnrollmentsService {
    constructor(private connection: Connection, @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    async getEnrollments(
        skip: number,
        take: number,
        ids: string[],
        sortKey: string,
        sortOrder: 'ASC' | 'DESC',
        enrollmentStatus?: EnrollmentStatus,
        courseKey?: string,
    ): Promise<AdminGetAllEnrollmentsResponseDto> {
        let query = this.connection.manager.getRepository(Enrollment).createQueryBuilder('enrollment');

        if (ids) {
            query = query.andWhere('enrollment.enrollmentId IN(:ids)', { ids });
        }
        if (enrollmentStatus) {
            query = query.andWhere('enrollment.enrollmentStatus = :enrollmentStatus', { enrollmentStatus });
        }
        if (courseKey) {
            query = query.andWhere('enrollment.courseKey LIKE :courseKey', { courseKey: '%' + courseKey + '%' });
        }
        const formattedSortKey = sortKey ? 'enrollment.' + sortKey : 'enrollment.createdDate';
        const enrollments = await query
            .skip(skip || 0)
            .take(take || 50)
            .orderBy(formattedSortKey, sortOrder || 'DESC')
            .getMany();
        const count = await query.getCount();

        const dto = new AdminGetAllEnrollmentsResponseDto();
        dto.enrollments = enrollments;
        dto.totalCount = count;
        return dto;
    }

    async getEnrollmentById(enrollmentId: string): Promise<Enrollment> {
        const enrollment = await this.connection.manager
            .getRepository(Enrollment)
            .createQueryBuilder('enrollment')
            .where('enrollment.enrollmentId = :enrollmentId', { enrollmentId })
            .getOne();

        if (!enrollment) {
            throw new BadRequestException(ResponseMessageEnums.INVALID_ENROLLMENT);
        }

        return enrollment;
    }

    async updateEnrollment(enrollmentId: string, adminUpdateEnrollmentDto: AdminUpdateEnrollmentDto): Promise<void> {
        await this.connection.transaction(async (manager) => {
            const enrollment = await manager.findOne(Enrollment, enrollmentId);

            if (enrollment.enrollmentStatus !== adminUpdateEnrollmentDto.enrollmentStatus) {
                enrollment.enrollmentStatus = adminUpdateEnrollmentDto.enrollmentStatus;
                await manager.save(enrollment);
            }
        });
    }

    async getAllRegisteredEnrollmentCount(courseId: string, entityManager?: EntityManager) {
        const manager = entityManager || this.connection.manager;

        return await manager
            .getRepository(Enrollment)
            .createQueryBuilder('enrollment')
            .leftJoinAndSelect('enrollment.course', 'course')
            .where('course.courseId = :courseId', { courseId })
            .andWhere('enrollment.enrollmentStatus = :enrollmentStatus', {
                enrollmentStatus: EnrollmentStatus.REGISTERED,
            })
            .getCount();
    }
}
