import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Connection, EntityManager } from 'typeorm';
import { Logger } from 'winston';
import { CheckExistenceResponseDto } from './dto/check-existence-response.dto';
import moment = require('moment');
import { ResponseMessageEnums } from 'src/response-handler/response.message.enum';
import { Student } from './entity/student.entity';
import { StudentStatus } from './entity/student.interface';

@Injectable()
export class StudentService {
    constructor(private connection: Connection, @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    async create(student: Student, entityManager?: EntityManager): Promise<Student> {
        const manager = entityManager || this.connection.manager;

        const alreadyExists = await manager.findOne(Student, {
            where: { email: student.email },
            select: ['studentId'],
        });
        if (alreadyExists && alreadyExists.status === StudentStatus.ACTIVATED) {
            throw new BadRequestException(ResponseMessageEnums.USER_ALREADY_EXISTS);
        }

        if (alreadyExists?.status === StudentStatus.DEACTIVATED) {
            throw new BadRequestException(ResponseMessageEnums.USER_DEACTIVATED);
        }
        return await manager.save(student);
    }

    async findById(studentId: string, entityManager?: EntityManager): Promise<Student | undefined> {
        const manager = entityManager || this.connection.manager;

        return await manager.findOne(Student, studentId);
    }

    async findAuthDetailsById(studentId: string, entityManager?: EntityManager): Promise<Student | undefined> {
        const manager = entityManager || this.connection.manager;

        return await manager
            .getRepository(Student)
            .createQueryBuilder('student')
            .where('student.studentId = :studentId', { studentId })
            .getOne();
    }

    async findOne(email: string, entityManager?: EntityManager): Promise<Student | undefined> {
        const manager = entityManager || this.connection.manager;

        return await manager
            .getRepository(Student)
            .createQueryBuilder('student')
            .andWhere('student.email = :email', { email })
            .getOne();
    }

    async findByEmail(email: string, entityManager?: EntityManager): Promise<Student | undefined> {
        const manager = entityManager || this.connection.manager;

        return await manager.findOne(Student, { email });
    }

    async checkExistenceOfStudent(email: string, entityManager?: EntityManager): Promise<CheckExistenceResponseDto> {

        const manager = entityManager || this.connection.manager;

        const student = await manager.findOne(Student, {
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

    async findBasicStudentDetails(studentId: string, entityManager?: EntityManager): Promise<Student> {

        const manager = entityManager || this.connection.manager;

        const student = await manager
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
