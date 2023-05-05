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

export class AdminGetCoursesDto {
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

    @ApiPropertyOptional({ type: String, description: 'Commas separated string of course IDs' })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsNotEmpty({ each: true })
    @MinLength(5, { each: true })
    @Matches(/^[0-9]+$/, { each: true })
    @Transform((value: string) => value.split(','))
    ids?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    q?: string;

    @ApiPropertyOptional({
        enum: ['courseId', 'createdDate', 'courseName'],
        enumName: 'SortKeyCourse',
    })
    @IsOptional()
    @IsEnum(['courseId', 'createdDate', 'courseName'])
    sortKey?: string;

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'], enumName: 'SortOrder' })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC';
}
