import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';

@Module({
    providers: [StudentService],
    controllers: [StudentController],
    imports: [],
    exports: [StudentService],
})
export class StudentModule {}
