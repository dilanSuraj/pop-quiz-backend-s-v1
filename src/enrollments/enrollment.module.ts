import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';

@Module({
    providers: [EnrollmentService],
    controllers: [],
    imports: [],
    exports: [EnrollmentService],
})
export class EnrollmentModule {}
