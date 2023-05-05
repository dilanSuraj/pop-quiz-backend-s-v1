import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Connection, EntityManager } from 'typeorm';
import { Logger } from 'winston';
import { Enrollment } from 'src/enrollments/entity/enrollments.entity';
import { ResponseMessageEnums } from 'src/response-handler/response.message.enum';
import { GetAllEnrollmentsByStudentResponseDto } from './dto/get-all-enrollments-by-user-response.dto';
import { EnrollmentStatus } from './enrollment-status.enum';
import { CourseService } from 'src/course/course.service';
import { generateEnrollmentId } from 'src/common/helpers/random-generator.helper';
import { StudentService } from 'src/student/student.service';

export const SERVICE_ID_LENGTH = 15;

@Injectable()
export class EnrollmentService {
    constructor(
        private connection: Connection,
        private courseService: CourseService,
        private studentService: StudentService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    async getAllEnrollments(
        studentId: string,
        skip?: number,
        take?: number,
        sortKey?: string,
        sortOrder?: 'ASC' | 'DESC',
        enrollmentStatus?: EnrollmentStatus,
        courseKey?: string,
        courseId?: string,
        entityManager?: EntityManager,
    ): Promise<GetAllEnrollmentsByStudentResponseDto> {
        const manager = entityManager || this.connection.manager;

        let query = manager
            .getRepository(Enrollment)
            .createQueryBuilder('enrollment')
            .leftJoinAndSelect('enrollment.student', 'student')
            .leftJoinAndSelect('enrollment.course', 'course')
            .where('student.studentId = :studentId', { studentId });

        if (enrollmentStatus) {
            query = query.andWhere('enrollment.enrollmentStatus = :enrollmentStatus', { enrollmentStatus });
        }

        if (courseId) {
            query = query.andWhere('course.courseId = :courseId', { courseId });
        }

        if (courseKey) {
            query = query.andWhere('enrollment.courseKey = :courseKey', { courseKey });
        }

        if (sortKey) {
            query = query.addOrderBy('service.' + sortKey || 'createdDate', sortOrder || 'ASC');
        }

        if ((skip || skip === 0) && take) {
            query = query.skip(skip);
        }

        if (take) {
            query = query.take(take);
        }

        const dto = new GetAllEnrollmentsByStudentResponseDto();

        const enrollments = await query.getMany();

        dto.enrollments = enrollments.map((enrollment) => {
            delete enrollment.student;
            return enrollment;
        });

        return dto;
    }

    async getEnrollmentByIdAndStudent(
        enrollmentId: string,
        studentId: string,
        entityManager?: EntityManager,
    ): Promise<Enrollment> {
        const manager = entityManager || this.connection.manager;

        const enrollment = await manager
            .getRepository(Enrollment)
            .createQueryBuilder('enrollment')
            .leftJoinAndSelect('enrollment.course', 'course')
            .leftJoinAndSelect('enrollment.student', 'student')
            .where('enrollment.enrollmentId = :enrollmentId', { enrollmentId })
            .andWhere('student.studentId = :studentId', { studentId })
            .getOne();

        if (!enrollment) {
            throw new BadRequestException(ResponseMessageEnums.INVALID_ENROLLMENT);
        }

        return enrollment;
    }

    async checkIfNewEnrollmentsAvailable(
        courseId: string,
        maxEnrollmentCount: number,
        entityManager?: EntityManager,
    ): Promise<Boolean> {
        const manager = entityManager || this.connection.manager;

        const registeredEnrollmentCount = await manager
            .getRepository(Enrollment)
            .createQueryBuilder('enrollment')
            .leftJoinAndSelect('enrollment.course', 'course')
            .where('course.courseId = :courseId', { courseId })
            .andWhere('enrollment.enrollmentStatus = :enrollmentStatus', {
                enrollmentStatus: EnrollmentStatus.REGISTERED,
            })
            .getCount();

        return (maxEnrollmentCount > registeredEnrollmentCount);
    }

    async courseEnrollment(studentId: string, courseId: string, entityManager?: EntityManager): Promise<Enrollment> {
        const manager = entityManager || this.connection.manager;

        const course = await this.courseService.getCourseById(courseId, manager);

        const isAvailableForNewEnrollments = await this.checkIfNewEnrollmentsAvailable(
            courseId,
            course?.maxEnrollmentCapacity,
            manager,
        );

        if (!isAvailableForNewEnrollments) {
            throw new BadRequestException(ResponseMessageEnums.ENROLLMENTS_MAX_COUNT_REACHED);
        }

        const enrollment = await manager
            .getRepository(Enrollment)
            .createQueryBuilder('enrollment')
            .leftJoinAndSelect('enrollment.course', 'course')
            .leftJoinAndSelect('enrollment.student', 'student')
            .where('course.courseId = :courseId', { courseId })
            .andWhere('student.studentId = :studentId', { studentId })
            .getOne();

        if (enrollment?.enrollmentStatus === EnrollmentStatus.REGISTERED) {
            throw new BadRequestException(ResponseMessageEnums.ENROLLMENT_ALREADY_EXISTS);
        }

        if (enrollment?.enrollmentStatus === EnrollmentStatus.UNREGISTERED) {
            enrollment.enrollmentStatus = EnrollmentStatus.REGISTERED;
            return await this.connection.manager.save(enrollment);
        }

        const newEnrollment = new Enrollment();

        newEnrollment.course = course;
        newEnrollment.courseKey = course.key;
        newEnrollment.enrollmentId = generateEnrollmentId();
        newEnrollment.enrollmentStatus = EnrollmentStatus.REGISTERED;

        const student = await this.studentService.findBasicStudentDetails(studentId);
        newEnrollment.student = student;

        return await manager.save(newEnrollment);
    }

    async courseUnregister(studentId: string, courseId: string, entityManager?: EntityManager): Promise<void> {
        const manager = entityManager || this.connection.manager;

        const enrollment = await manager
            .getRepository(Enrollment)
            .createQueryBuilder('enrollment')
            .leftJoinAndSelect('enrollment.course', 'course')
            .leftJoinAndSelect('enrollment.student', 'student')
            .where('course.courseId = :courseId', { courseId })
            .andWhere('student.studentId = :studentId', { studentId })
            .andWhere('enrollment.enrollmentStatus = :enrollmentStatus', {
                enrollmentStatus: EnrollmentStatus.REGISTERED,
            })
            .getOne();

        if (!enrollment) {
            throw new BadRequestException(ResponseMessageEnums.NOT_YET_ENROLLED);
        }

        enrollment.enrollmentStatus = EnrollmentStatus.UNREGISTERED;
        await manager.save(enrollment);
    }
}
