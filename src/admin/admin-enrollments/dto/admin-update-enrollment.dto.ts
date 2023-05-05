import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EnrollmentStatus } from 'src/enrollments/enrollment-status.enum';

export class AdminUpdateEnrollmentDto {
    @ApiProperty({ enum: EnrollmentStatus, enumName: 'EnrollmentStatus' })
    @IsEnum(EnrollmentStatus)
    enrollmentStatus: EnrollmentStatus;
}
