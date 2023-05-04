import { ApiProperty } from '@nestjs/swagger';
import { Course } from '../entity/course.entity';

export class GetAvailableCoursesResponseDto {
    @ApiProperty()
    courses: Course[];

    @ApiProperty()
    totalCount: number;
}
