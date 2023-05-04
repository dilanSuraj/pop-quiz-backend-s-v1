import { ApiProperty } from '@nestjs/swagger';
import { Course } from 'src/course/entity/course.entity';

export class AdminGetCoursesResponseDto {
    @ApiProperty()
    courses: Course[];

    @ApiProperty()
    totalCount: number;
}
