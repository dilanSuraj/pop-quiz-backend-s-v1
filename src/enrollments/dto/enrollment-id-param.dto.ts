import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EnrollmentIdParamDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    enrollmentId: string;
}
