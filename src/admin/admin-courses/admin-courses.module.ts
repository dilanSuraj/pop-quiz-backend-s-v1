import { Module } from '@nestjs/common';
import { AdminCoursesService } from './admin-courses.service';
import { AdminCoursesController } from './admin-courses.controller';
import { AdminAdminsModule } from '../admin-admins/admin-admins.module';

@Module({
    providers: [AdminCoursesService],
    controllers: [AdminCoursesController],
    imports: [AdminAdminsModule],
})
export class AdminCoursesModule {}
