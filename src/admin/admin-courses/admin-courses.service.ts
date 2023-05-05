import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Connection, EntityManager, IsNull } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Course } from 'src/course/entity/course.entity';
import { getModifiedTextSearchQuery } from 'src/common/helpers/search-query.helper';
import { EnrollmentStatus } from 'src/enrollments/enrollment-status.enum';
import { AdminGetCoursesResponseDto } from './dto/admin-get-courses-response.dto';
import { AdminCreateCourseDto } from './dto/admin-create-course.dto';
import { generateCourseId } from 'src/common/helpers/random-generator.helper';
import { ResponseMessageEnums } from 'src/response-handler/response.message.enum';
import { AdminUpdateCourseDto } from './dto/admin-update-course.dto';
import { AdminAdminsService } from '../admin-admins/admin-admins.service';
import { AdminEnrollmentsService } from '../admin-enrollments/admin-enrollments.service';

@Injectable()
export class AdminCoursesService {
    constructor(
        private connection: Connection,
        private adminEnrollmentsService: AdminEnrollmentsService,
        private adminAdminsService: AdminAdminsService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    async getCourses(
        skip: number,
        take: number,
        ids: string[],
        q: string,
        sortKey: string,
        sortOrder: 'ASC' | 'DESC',
    ): Promise<AdminGetCoursesResponseDto> {
        let query = this.connection.manager
            .getRepository(Course)
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.enrollments', 'enrollment');

        if (ids) {
            query = query.andWhere('course.courseId IN(:ids)', { ids });
        }

        if (q) {
            const modifiedQ = getModifiedTextSearchQuery(q);
            if (modifiedQ) {
                query = query.andWhere('(MATCH(course.courseName) AGAINST(:q IN BOOLEAN MODE))', {
                    q: modifiedQ,
                });
            }
        }

        let formattedSortKey = 'course.' + (sortKey || 'createdDate');
        const courses = await query
            .skip(skip || 0)
            .take(take || 50)
            .orderBy(formattedSortKey, sortOrder || 'DESC')
            .getMany();
        const count = await query.getCount();

        const dto = new AdminGetCoursesResponseDto();
        dto.courses = courses;
        dto.totalCount = count;
        return dto;
    }

    async getCourseById(courseId: string): Promise<Course> {
        let course = null;
        await this.connection.transaction(async (manager) => {
            course = await manager.findOne(Course, courseId, {
                relations: ['enrollments'],
            });

            if (!course) {
                throw new BadRequestException('Invalid course ID');
            }

            const enrollmentStatusGroupBy = course.enrollments.reduce(function (accumulator: any, currentObject: any) {
                let key = currentObject['enrollmentStatus'];
                if (!accumulator[key]) {
                    accumulator[key] = 1;
                } else {
                    accumulator[key] += 1;
                }

                return accumulator;
            }, {});

            course.unregisteredEnrollmentCount = enrollmentStatusGroupBy[EnrollmentStatus.UNREGISTERED];
            course.registeredEnrollmentCount = enrollmentStatusGroupBy[EnrollmentStatus.REGISTERED];

            delete course.enrollments;
        });
        return course;
    }

    async createCourse(adminUserId: string, adminCreateCourseDto: AdminCreateCourseDto, entityManager?: EntityManager): Promise<Course> {

        const manager = entityManager || this.connection.manager;
        const adminUser = await this.adminAdminsService.getAdminById(adminUserId, manager);
        const newCourse = new Course();
        newCourse.courseId = generateCourseId();
        newCourse.courseName = adminCreateCourseDto.courseName;
        newCourse.manageBy = adminUser;
        newCourse.key = adminCreateCourseDto.courseKey;
        newCourse.maxEnrollmentCapacity = adminCreateCourseDto.maxEnrollmentCapacity;

        return await manager.save(newCourse);
    }

    async updateCourse(adminUserId: string, courseId: string, adminUpdateCourseDto: AdminUpdateCourseDto): Promise<void> {
        let course = null;
        await this.connection.transaction(async (manager) => {

            const adminUser = await this.adminAdminsService.getAdminById(adminUserId, manager);
            course = await manager.findOne(Course, courseId, {
                relations: ['manageBy'],
            });

            if (!course) {
                throw new BadRequestException(ResponseMessageEnums.INVALID_COURSE);
            }

            if (!adminUpdateCourseDto?.courseName) {
                delete adminUpdateCourseDto.courseName;
            }

            if (!adminUpdateCourseDto?.key) {
                delete adminUpdateCourseDto.key;
            }

            if (adminUpdateCourseDto?.maxEnrollmentCapacity >= 0) {
                const currentEnrollmentCount = await this.adminEnrollmentsService.getAllRegisteredEnrollmentCount(courseId, manager);
                if (currentEnrollmentCount > adminUpdateCourseDto?.maxEnrollmentCapacity) {
                    throw new BadRequestException(ResponseMessageEnums.MAX_ENROLLMENT_COUNT_CANNOT_BE_REDUCED);
                }
            } else {
                delete adminUpdateCourseDto.maxEnrollmentCapacity;
            }

            if (adminUpdateCourseDto) {
                await manager.update(
                    Course,
                    { courseId },
                    {
                        ...adminUpdateCourseDto,
                        manageBy: adminUser,
                    },
                );
            }
        });
    }
}
