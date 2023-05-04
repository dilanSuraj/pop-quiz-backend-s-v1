import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetCourseDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    courseId: string;
}
