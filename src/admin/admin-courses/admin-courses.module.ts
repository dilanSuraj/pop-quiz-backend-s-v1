import { Module } from '@nestjs/common';
import { AdminCoursesService } from './admin-courses.service';
import { AdminCoursesController } from './admin-courses.controller';
import { AdminAdminsModule } from '../admin-admins/admin-admins.module';
import { AdminEnrollmentsModule } from '../admin-enrollments/admin-enrollments.module';

@Module({
    providers: [AdminCoursesService],
    controllers: [AdminCoursesController],
    imports: [AdminAdminsModule, AdminEnrollmentsModule],
    exports: [AdminCoursesService],
})
export class AdminCoursesModule {}
