import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class AdminGetAdminsDto {
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
    @IsString()
    @IsNotEmpty()
    userId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    username?: string;

    @ApiPropertyOptional({ enum: ['userId', 'username'], enumName: 'SortKey' })
    @IsOptional()
    @IsEnum(['userId', 'username'])
    sortKey?: string;

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'], enumName: 'SortOrder' })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC';
}
