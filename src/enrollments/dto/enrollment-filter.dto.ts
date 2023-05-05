import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional, Max, IsInt, IsNotEmpty, IsBooleanString, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { EnrollmentStatus } from '../enrollment-status.enum';

export class EnrollmentFilterDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    skip?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @IsInt()
    @Min(5)
    @Max(100)
    @Type(() => Number)
    take?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    courseId?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    studentId: string;

    @ApiPropertyOptional({ enum: ['enrollmentId', 'createdDate'], enumName: 'SortKeyEnrollment' })
    @IsOptional()
    @IsEnum(['enrollmentId', 'createdDate'])
    sortKey?: string;

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'], enumName: 'SortOrder' })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC';

    @ApiPropertyOptional({ enum: EnrollmentStatus, enumName: 'enrollmentStatus' })
    @IsOptional()
    @IsEnum(EnrollmentStatus)
    enrollmentStatus?: EnrollmentStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBooleanString()
    courseKey?: string;
}
