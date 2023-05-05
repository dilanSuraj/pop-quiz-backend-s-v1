import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Connection, EntityManager } from 'typeorm';
import { Logger } from 'winston';
import { Course } from './entity/course.entity';
import { EnrollmentStatus } from 'src/enrollments/enrollment-status.enum';
import { Enrollment } from 'src/enrollments/entity/enrollments.entity';
import { GetAvailableCoursesResponseDto } from './dto/get-available-courses-response.dto';
import { ResponseMessageEnums } from 'src/response-handler/response.message.enum';

export const SERVICE_ID_LENGTH = 15;

@Injectable()
export class CourseService {
    constructor(private connection: Connection,  @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    async getAll(skip?: number, take?: number, courseName?: string, entityManager?: EntityManager): Promise<GetAvailableCoursesResponseDto> {

        const manager = entityManager || this.connection.manager;

        let coursesQuery = manager
            .getRepository(Course)
            .createQueryBuilder('course')
            .select('course.courseId', 'courseId')
            .addSelect('course.key', 'key')
            .addSelect('course.courseName', 'courseName')
            .addSelect('course.maxEnrollmentCapacity', 'maxEnrollmentCapacity')
            .addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(enrollment.enrollmentId)', 'count')
                    .from(Enrollment, 'enrollment')
                    .where('enrollment.courseKey = course.key')
                    .andWhere('enrollment.enrollmentStatus = :enrollmentStatus', {
                        enrollmentStatus: EnrollmentStatus.REGISTERED,
                    });
            }, 'enrollmentCount');

        if (courseName) {
            coursesQuery = coursesQuery.andWhere('course.courseName = :courseName', { courseName });
        }

        const courses = await coursesQuery.getRawMany();

        const availableCourses = courses?.filter(
            ({ maxEnrollmentCapacity, enrollmentCount }) => maxEnrollmentCapacity > enrollmentCount,
        );

        const dto = new GetAvailableCoursesResponseDto();

        dto.courses = availableCourses?.length > 0 ? availableCourses.slice(skip || 0, (skip || 0) + (take || 10)) : [];
        dto.totalCount = availableCourses?.length || 0;

        return dto;
    }

    async getCourseById(courseId: string, entityManager?: EntityManager): Promise<Course> {

        const manager = entityManager || this.connection.manager;

        const course = await manager.findOne(Course, courseId);

        if (!course) {
            throw new BadRequestException(ResponseMessageEnums.INVALID_COURSE);
        }

        return course;
    }
}
