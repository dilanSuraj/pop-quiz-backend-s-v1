import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AdminCourseIdDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    courseId: string;
}
