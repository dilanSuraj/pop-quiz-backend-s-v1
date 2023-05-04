import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StudentStatus } from 'src/student/entity/student.interface';

export class AdminUpdateStudentDto {

    @ApiPropertyOptional({ enum: StudentStatus, enumName: 'StudentStatus' })
    @IsEnum(StudentStatus)
    studentStatus: StudentStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    studentName: string;
}
