import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AdminStudentIdDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    studentId: string;
}
