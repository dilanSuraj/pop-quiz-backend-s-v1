import { ApiProperty } from '@nestjs/swagger';
import { Enrollment } from 'src/enrollments/entity/enrollments.entity';

export class AdminGetAllEnrollmentsResponseDto {
    @ApiProperty()
    enrollments: Enrollment[];

    @ApiProperty()
    totalCount: number;
}
