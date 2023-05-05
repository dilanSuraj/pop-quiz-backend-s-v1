import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppExceptionFilter } from './common/exception-filters/app-exception.filter';
import { AppLoggingInterceptor } from './common/interceptors/app-logging.interceptor';
import { FilterFieldsInterceptor } from './common/interceptors/filter-fields.interceptor';
import { typeOrmConfig } from './config/typeorm.config';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollments/enrollment.module';
import { StudentModule } from './student/student.module';
import { AdminAdminsModule } from './admin/admin-admins/admin-admins.module';
import { AdminAuthModule } from './admin/admin-auth/admin-auth.module';
import { AdminCoursesModule } from './admin/admin-courses/admin-courses.module';
import { AdminEnrollmentsModule } from './admin/admin-enrollments/admin-enrollments.module';
import { AdminStudentsModule } from './admin/admin-students/admin-students.module';

@Module({
    providers: [
        {
            provide: APP_FILTER,
            useClass: AppExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: AppLoggingInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: FilterFieldsInterceptor,
        },
    ],
    imports: [
        WinstonModule.forRoot(winstonConfig),
        TypeOrmModule.forRoot(typeOrmConfig),
        AuthModule,
        CourseModule,
        EnrollmentModule,
        StudentModule,
        AdminAdminsModule,
        AdminAuthModule,
        AdminCoursesModule,
        AdminEnrollmentsModule,
        AdminStudentsModule,
    ],
})
export class AppModule {}
