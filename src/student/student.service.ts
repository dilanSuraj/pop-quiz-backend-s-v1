import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Connection } from 'typeorm';
import { Logger } from 'winston';
import { CheckExistenceResponseDto } from './dto/check-existence-response.dto';
import moment = require('moment');
import { ResponseMessageEnums } from 'src/response-handler/response.message.enum';
import { Student } from './entity/student.entity';
import { StudentStatus } from './entity/student.interface';

@Injectable()
export class StudentService {
    constructor(private connection: Connection, @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    async create(student: Student): Promise<Student> {
        const alreadyExists = await this.connection.manager.findOne(Student, {
            where: { email: student.email },
            select: ['studentId'],
        });
        if (alreadyExists && alreadyExists.status === StudentStatus.ACTIVATED) {
            throw new BadRequestException(ResponseMessageEnums.USER_ALREADY_EXISTS);
        }

        if (alreadyExists?.status === StudentStatus.DEACTIVATED) {
            throw new BadRequestException(ResponseMessageEnums.USER_DEACTIVATED);
        }
        await this.connection.manager.save(student);
        return student;
    }

    async findById(studentId: string): Promise<Student | undefined> {
        return await this.connection.manager.findOne(Student, studentId);
    }

    async findAuthDetailsById(studentId: string): Promise<Student | undefined> {
        return await this.connection.manager
            .getRepository(Student)
            .createQueryBuilder('student')
            .where('student.studentId = :studentId', { studentId })
            .getOne();
    }

    async findOne(email: string): Promise<Student | undefined> {
        return await this.connection.manager
            .getRepository(Student)
            .createQueryBuilder('student')
            .andWhere('student.email = :email', { email })
            .getOne();
    }

    async findByEmail(email: string): Promise<Student | undefined> {
        return await this.connection.manager.findOne(Student, { email });
    }

    async checkExistenceOfStudent(email: string): Promise<CheckExistenceResponseDto> {
        const student = await this.connection.manager.findOne(Student, {
            where: { email },
        });

        const dto = new CheckExistenceResponseDto();
        if (student) {
            dto.exists = true;
            dto.studentId = student.studentId;
            dto.studentName = student.name;
        } else {
            dto.exists = false;
        }
        return dto;
    }

    async findBasicStudentDetails(studentId: string): Promise<Student> {
        const student = await this.connection.manager
            .getRepository(Student)
            .createQueryBuilder('student')
            .addSelect('student.name')
            .addSelect('student.email')
            .addSelect('student.status')
            .where('student.studentId = :studentId', { studentId })
            .andWhere('student.status = :status', { status: StudentStatus.ACTIVATED })
            .getOne();

        if (!student) {
            throw new UnauthorizedException();
        }

        return student;
    }
}
