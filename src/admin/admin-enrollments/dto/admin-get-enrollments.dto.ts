import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsOptional,
    IsNumber,
    IsInt,
    Min,
    Max,
    IsArray,
    ArrayNotEmpty,
    IsNotEmpty,
    MinLength,
    Matches,
    IsString,
    IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { EnrollmentStatus } from 'src/enrollments/enrollment-status.enum';

export class AdminGetEnrollmentsDto {
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

    @ApiPropertyOptional({ type: String, description: 'Commas separated string of service IDs' })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsNotEmpty({ each: true })
    @MinLength(5, { each: true })
    @Matches(/^[0-9]+$/, { each: true })
    @Transform((value: string) => value.split(','))
    ids?: string[];

    @ApiPropertyOptional({ enum: EnrollmentStatus, enumName: 'EnrollmentStatus' })
    @IsOptional()
    @IsEnum(EnrollmentStatus)
    status?: EnrollmentStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    courseKey?: string;

    @ApiPropertyOptional({
        enum: ['serviceId', 'createdDate', 'title', 'ownerName', 'categoryDisplayName'],
        enumName: 'SortKeyService',
    })
    @IsOptional()
    @IsEnum(['serviceId', 'createdDate', 'title', 'ownerName', 'categoryDisplayName'])
    sortKey?: string;

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'], enumName: 'SortOrder' })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC';
}
