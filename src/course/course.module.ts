import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
    providers: [CourseService],
    controllers: [CourseController],
    imports: [],
    exports: [CourseService],
})
export class CourseModule {}
