import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { generateSalt, hashPassword } from 'src/common/helpers/hash-password.helper';
import { Logger } from 'winston';
import { LoginResponseDto } from './dto/login-response.dto';
import { StudentStatus } from 'src/student/entity/student.interface';
import { Student } from 'src/student/entity/student.entity';
import { StudentService } from 'src/student/student.service';
import { generateStudentId } from 'src/common/helpers/random-generator.helper';
import { ResponseMessageEnums } from 'src/response-handler/response.message.enum';

@Injectable()
export class AuthService {
    constructor(
        private studentService: StudentService,
        private jwtService: JwtService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    async findStudentByEmail(email: string): Promise<Student | undefined> {
        return await this.studentService.findByEmail(email);
    }

    async findAuthDetails(studentId: string): Promise<Student | undefined> {
        return await this.studentService.findAuthDetailsById(studentId);
    }

    async validateLocalStudent(email: string, password: string): Promise<Student | null> {
        const student: Student = await this.studentService.findOne(email);

        if (student && (await this.validatePassword(password, student))) {
            return student;
        }
        return null;
    }

    async login(
        reqStudent: {
            studentId: string;
        },
        email: string,
    ): Promise<LoginResponseDto> {
        const { studentId } = reqStudent;

        const student = await this.studentService.findById(studentId);
        if (student?.status === StudentStatus.DEACTIVATED) {
            throw new BadRequestException(ResponseMessageEnums.USER_DEACTIVATED);
        }

        return this.constructLoginResponse(studentId, email);
    }

    async validatePassword(password: string, student: Student): Promise<boolean> {
        const hash = await hashPassword(password, student.salt);
        return hash === student.password;
    }

    private constructLoginResponse(studentId: string, email: string): LoginResponseDto {
        const studentJwtPayload = { sub: studentId, email };

        const dto = new LoginResponseDto();
        dto.studentId = studentId;
        dto.studentAccessToken = this.jwtService.sign(studentJwtPayload);
        return dto;
    }

    async signUp(email: string, name: string, password: string): Promise<LoginResponseDto> {
        const alreadyExistStudent = await this.studentService.findOne(email);

        if (alreadyExistStudent && alreadyExistStudent?.status === StudentStatus.DEACTIVATED) {
            throw new BadRequestException(ResponseMessageEnums.USER_DEACTIVATED);
        }
        else if (alreadyExistStudent && alreadyExistStudent?.status === StudentStatus.ACTIVATED) {
            throw new BadRequestException(ResponseMessageEnums.USER_ALREADY_EXISTS);
        }

        const student = new Student();

        student.email = email;
        student.name = name;
        const salt = await generateSalt();
        student.studentId = generateStudentId();

        student.password = await hashPassword(password, salt);
        student.salt = salt;

        const savedStudent = await this.studentService.create(student);

        return this.constructLoginResponse(savedStudent.studentId, savedStudent.email);
    }
}
