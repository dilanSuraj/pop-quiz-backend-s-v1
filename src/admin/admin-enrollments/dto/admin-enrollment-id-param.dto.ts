import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminEnrollmentIdParamDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    enrollmentId: string;
}
