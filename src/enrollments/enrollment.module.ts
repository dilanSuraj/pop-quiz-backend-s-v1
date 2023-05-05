import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { CourseModule } from 'src/course/course.module';
import { StudentModule } from 'src/student/student.module';

@Module({
    providers: [EnrollmentService],
    controllers: [EnrollmentController],
    imports: [CourseModule, StudentModule],
    exports: [EnrollmentService],
})
export class EnrollmentModule {}
