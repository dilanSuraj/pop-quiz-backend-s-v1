import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsInt, Min, IsString, MaxLength, IsOptional } from 'class-validator';

export class AdminUpdateCourseDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(100)
    courseName: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @IsInt()
    @Min(0)
    maxEnrollmentCapacity: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(100)
    key: string;
}
