import { Module } from '@nestjs/common';
import { AdminEnrollmentsController } from './admin-enrollments.controller';
import { AdminEnrollmentsService } from './admin-enrollments.service';

@Module({
    providers: [AdminEnrollmentsService],
    controllers: [AdminEnrollmentsController],
    imports: [],
    exports: [AdminEnrollmentsService],
})
export class AdminStudentsModule {}
