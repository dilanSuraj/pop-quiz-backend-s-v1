import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Connection, In } from 'typeorm';
import { userConfig } from 'src/config/user-config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Student } from 'src/student/entity/student.entity';
import { AdminGetStudentsResponseDto } from './dto/admin-get-students-response.dto';
import { AdminUpdateStudentDto } from './dto/admin-update-student.dto';

@Injectable()
export class AdminStudentsService {
    constructor(private connection: Connection, @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    async getStudents(
        skip: number,
        take: number,
        ids: string[],
        email: string,
        name: string,
        sortKey: string,
        sortOrder: 'ASC' | 'DESC',
    ): Promise<AdminGetStudentsResponseDto> {
        let query = this.connection.manager.getRepository(Student).createQueryBuilder('student');

        if (ids) {
            query = query.andWhere('student.studentId IN(:ids)', { ids });
        }
        if (email) {
            query = query.andWhere('student.email LIKE :email', { email: '%' + email + '%' });
        }
        if (name) {
            query = query.andWhere('(student.name LIKE :name OR student.name LIKE :name OR student.name LIKE :name)', {
                name: '%' + name + '%',
            });
        }
        const formattedSortKey = sortKey ? 'student.' + sortKey : 'student.joinedDate';
        const students = await query
            .skip(skip || 0)
            .take(take || 50)
            .orderBy(formattedSortKey, sortOrder || 'DESC')
            .getMany();
        const count = await query.getCount();

        const dto = new AdminGetStudentsResponseDto();
        dto.students =
            students.map((student) => ({
                ...student,
                password: undefined,
                salt: undefined,
            })) || [];
        dto.totalCount = count;
        return dto;
    }

    async getStudentById(studentId: string): Promise<Student> {
        const student = await this.connection.manager
            .getRepository(Student)
            .createQueryBuilder('student')
            .leftJoinAndSelect('student.enrollments', 'enrollments')
            .leftJoinAndSelect('enrollments.course', 'course')
            .addSelect('enrollments.enrollmentStatus')
            .addSelect('enrollments.enrollmentId')
            .addSelect('student.name')
            .addSelect('student.studentId')
            .addSelect('student.email')
            .addSelect('student.status')
            .where('student.studentId = :studentId', { studentId })
            .getOne();

        if (!student) {
            throw new BadRequestException('Invalid student ID');
        }

        student.password = undefined;
        student.salt = undefined;
        return student;
    }

    async updateStudent(studentId: string, adminUpdateStudentDto: AdminUpdateStudentDto): Promise<void> {
        await this.connection.transaction(async (manager) => {
            const student = await manager.findOne(Student, studentId);

            if (student.status !== adminUpdateStudentDto.studentStatus) {
                student.status = adminUpdateStudentDto.studentStatus;
            }

            if (adminUpdateStudentDto.studentName && adminUpdateStudentDto.studentName !== student.name) {
                student.name = adminUpdateStudentDto.studentName;
            }

            await manager.save(student);
            return;
        });
    }

    // async createStudent(adminCreateUserDto: AdminCreateUserDto): Promise<AdminCreateUserResponseDto> {
    //     const user = await this.authService.signUpUser(
    //         adminCreateUserDto.email,
    //         adminCreateUserDto.name,
    //         Authentication.LOCAL,
    //         true,
    //         adminCreateUserDto.password,
    //         undefined,
    //         adminCreateUserDto.phoneNumber,
    //         adminCreateUserDto.country,
    //         undefined,
    //         undefined,
    //         undefined,
    //     );

    //     const dto = new AdminCreateUserResponseDto();
    //     dto.userId = user.userId;
    //     return dto;
    // }
}
