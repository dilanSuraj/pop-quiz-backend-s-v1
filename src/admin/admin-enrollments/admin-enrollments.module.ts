import { Module } from '@nestjs/common';
import { AdminEnrollmentsController } from './admin-enrollments.controller';
import { AdminEnrollmentsService } from './admin-enrollments.service';
import { CourseModule } from 'src/course/course.module';

@Module({
    providers: [AdminEnrollmentsService],
    controllers: [AdminEnrollmentsController],
    imports: [CourseModule],
    exports: [AdminEnrollmentsService],
})
export class AdminEnrollmentsModule {}
