import { ApiProperty } from '@nestjs/swagger';
import { Student } from 'src/student/entity/student.entity';

export class AdminGetStudentsResponseDto {
    @ApiProperty()
    students: Student[];

    @ApiProperty()
    totalCount: number;
}
