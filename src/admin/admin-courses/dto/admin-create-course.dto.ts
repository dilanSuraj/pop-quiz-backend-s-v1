import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsInt, Min, MaxLength } from 'class-validator';

export class AdminCreateCourseDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    courseName: string;

    @ApiProperty()
    @IsNumber()
    @IsInt()
    @Min(0)
    maxEnrollmentCapacity: number;
}
