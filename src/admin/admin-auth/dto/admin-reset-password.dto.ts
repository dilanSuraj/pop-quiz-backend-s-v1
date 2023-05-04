import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class AdminResetPasswordDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Length(5)
    oldPassword: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(5, 100)
    newPassword: string;
}
