import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CourseEnrollmentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    courseId: string;
}
