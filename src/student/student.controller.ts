import { Controller, Get, UseGuards, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetStudent } from 'src/common/decorators/get-student.decorator';
import { StudentService } from './student.service';
import { Student } from './entity/student.entity';
import { ReqStudentInfo } from 'src/auth/interfaces/req-student-info.interface';

@ApiTags('student')
@ApiBearerAuth()
@Controller('student')
export class StudentController {
    constructor(private studentService: StudentService) {}

    @Get('me')
    @ApiOkResponse({
        description: 'Current student',
        type: Student,
    })
    @UseGuards(JwtAuthGuard)
    getMyStudent(@GetStudent() student: ReqStudentInfo): Promise<Student> {
        return this.studentService.findBasicStudentDetails(student.studentId);
    }
}
