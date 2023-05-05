import { ApiProperty } from '@nestjs/swagger';
import { Enrollment } from '../entity/enrollments.entity';

export class GetAllEnrollmentsByStudentResponseDto {
    @ApiProperty()
    enrollments: Enrollment[];
}
