import { Module } from '@nestjs/common';
import { AdminStudentsController } from './admin-students.controller';
import { AdminStudentsService } from './admin-students.service';

@Module({
    providers: [AdminStudentsService],
    controllers: [AdminStudentsController],
    imports: [],
    exports: [AdminStudentsService],
})
export class AdminStudentsModule {}
