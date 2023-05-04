import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Connection, IsNull } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Course } from 'src/course/entity/course.entity';
import { getModifiedTextSearchQuery } from 'src/common/helpers/search-query.helper';
import { EnrollmentStatus } from 'src/enrollments/enrollment-status.enum';
import { AdminGetCoursesResponseDto } from './dto/admin-get-services-response.dto';
import { AdminCreateCourseDto } from './dto/admin-create-course.dto';

@Injectable()
export class AdminCoursesCourse {
    constructor(
        private connection: Connection,
        private coursesCourse: CourseService,
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

    async createCourse(adminUserId: string, adminCreateCourseDto: AdminCreateCourseDto): Promise<Course> {
        return await this.coursesCourse.createCourse(adminUserId, adminCreateCourseDto);
    }

    async updateCourse(courseId: string, adminUpdateCourseDto: AdminUpdateCourseDto): Promise<void> {
        let course = null;
        await this.connection.transaction(async (manager) => {
            course = await manager.findOne(Course, courseId, {
                relations: ['owner', 'category', 'owner.secondaryCategories', 'owner.category', 'packs'],
            });

            if (!course) {
                throw new BadRequestException('Invalid course');
            } else if (
                course.status !== CourseStatus.PENDING_APPROVAL &&
                adminUpdateCourseDto.status === CourseStatus.PENDING_APPROVAL
            ) {
                throw new BadRequestException('Course is already approved');
            }

            const pendingPurchasedPacks = course.packs?.length
                ? await this.connection.manager
                      .getRepository(Pack)
                      .createQueryBuilder('pack')
                      .innerJoin('pack.purchasedPacks', 'purchasedPacks')
                      .innerJoin('pack.course', 'course', 'course.courseId = :courseId', { courseId })
                      .where('purchasedPacks.isPackCompleted = :isPackCompleted', { isPackCompleted: false })
                      .andWhere('purchasedPacks.isPackExpired = :isPackExpired', { isPackExpired: false })
                      .getMany()
                : undefined;

            if (adminUpdateCourseDto.status === CourseStatus.INACTIVE) {
                const pendingBookings = await manager
                    .getRepository(Booking)
                    .createQueryBuilder('booking')
                    .innerJoin('booking.course', 'course', 'course.courseId = :courseId', { courseId })
                    .where('booking.status = :bookingStatus', { bookingStatus: BookingStatus.ACCEPTED })
                    .select(['booking.bookingId'])
                    .getOne();

                if (pendingBookings || pendingPurchasedPacks?.length) {
                    throw new BadRequestException(
                        'Cannot set the course status as inactive when there are pending/ scheduled bookings',
                    );
                }
            }

            if (
                course?.category?.key &&
                course?.category?.key !== adminUpdateCourseDto?.categoryKey &&
                adminUpdateCourseDto?.categoryKey
            ) {
                const category = await manager.findOne(Category, {
                    key: adminUpdateCourseDto?.categoryKey,
                });
                if (!category) {
                    throw new BadRequestException('The category is not valid');
                }
                if (
                    !(course?.owner?.secondaryCategories || []).find(
                        (secondaryCategory) => secondaryCategory.key === adminUpdateCourseDto?.categoryKey,
                    ) &&
                    course?.owner?.category?.key !== adminUpdateCourseDto?.categoryKey
                ) {
                    throw new BadRequestException('This is category is not in the particular owner category list');
                }
                course.category = category;
                course.categoryKey = category?.key;
                await manager.save(course);
            }

            delete adminUpdateCourseDto?.categoryKey;

            if (adminUpdateCourseDto?.packs && adminUpdateCourseDto?.packs?.length) {
                if (!course.packs) {
                    throw new BadRequestException('Invalid packs');
                }
                const validPacks = course.packs.filter((pack) => pack.status !== PackStatus.DELETED);
                if (adminUpdateCourseDto.packs.length !== validPacks.length) {
                    throw new BadRequestException('Invalid number of packs');
                }
                const packIdsInDto = adminUpdateCourseDto.packs.map((pack) => pack.packId);
                const packIdsInCourse = validPacks.map((pack) => pack.packId);
                if (!packIdsInCourse.every((packId) => packIdsInDto.includes(packId))) {
                    throw new BadRequestException('Invalid pack ids');
                }

                const purchasedPackIds = [
                    ...new Set(pendingPurchasedPacks.map((purchasedPack) => purchasedPack.packId)),
                ];

                adminUpdateCourseDto.packs.forEach((pack) => {
                    if (pack.status === PackStatus.INACTIVE && purchasedPackIds.includes(pack.packId)) {
                        throw new BadRequestException(
                            'Cannot set the pack status as inactive when there are pending/ scheduled bookings',
                        );
                    }
                });

                const packs = adminUpdateCourseDto.packs.map((data) => {
                    const pack = new Pack();
                    Object.assign(pack, data);
                    return pack;
                });
                await manager.save(packs);
            }

            delete adminUpdateCourseDto?.packs;
            await manager.update(Course, { courseId }, adminUpdateCourseDto);
        });

        if (
            course &&
            course?.status === CourseStatus.PENDING_APPROVAL &&
            adminUpdateCourseDto.status !== CourseStatus.PENDING_APPROVAL &&
            course?.owner?.userId
        ) {
            const user = await this.connection.manager.findOne(User, course.owner.userId);
            if (user?.email) {
                await this.emailCourse.sendCourseApprovedEmail(user?.email, course);
            }
        }
    }
}
