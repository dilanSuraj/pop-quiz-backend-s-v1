import { Controller, Delete, Get, Param, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ClassValidationPipe } from 'src/common/pipes/class-validation.pipe';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EnrollmentService } from './enrollment.service';
import { GetAllEnrollmentsByStudentResponseDto } from './dto/get-all-enrollments-by-user-response.dto';
import { Enrollment } from './entity/enrollments.entity';
import { GetStudent } from 'src/common/decorators/get-student.decorator';
import { ReqStudentInfo } from 'src/auth/interfaces/req-student-info.interface';
import { EnrollmentIdParamDto } from './dto/enrollment-id-param.dto';
import { EnrollmentFilterDto } from './dto/enrollment-filter.dto';
import { CourseEnrollmentDto } from './dto/course-enrollment.dto';

@ApiTags('enrollment')
@ApiBearerAuth()
@Controller('enrollment')
export class EnrollmentController {
    constructor(private enrollmentService: EnrollmentService) {}

    @Get()
    @ApiOkResponse({
        description: 'Enrollments',
        type: GetAllEnrollmentsByStudentResponseDto,
    })
    @UseGuards(JwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    getAvailableEnrollments(
        @GetStudent() student: ReqStudentInfo,
        @Query() enrollmentFilterDto: EnrollmentFilterDto,
    ): Promise<GetAllEnrollmentsByStudentResponseDto> {
        return this.enrollmentService.getAllEnrollments(
            student.studentId,
            enrollmentFilterDto.skip,
            enrollmentFilterDto.take,
            enrollmentFilterDto.sortKey,
            enrollmentFilterDto.sortOrder,
            enrollmentFilterDto.enrollmentStatus,
            enrollmentFilterDto.courseKey,
            enrollmentFilterDto.courseId,
        );
    }

    @Get(':enrollmentId')
    @ApiOkResponse({
        description: 'Enrollment',
        type: Enrollment,
    })
    @UseGuards(JwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    getEnrollmentByIdAndStudent(
        @GetStudent() student: ReqStudentInfo,
        @Param() enrollmentIdParamDto: EnrollmentIdParamDto,
    ): Promise<Enrollment> {
        return this.enrollmentService.getEnrollmentByIdAndStudent(enrollmentIdParamDto.enrollmentId, student.studentId);
    }

    @Put('course/:courseId')
    @ApiOkResponse({
        description: 'Enrollment',
        type: Enrollment,
    })
    @UseGuards(JwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    courseEnrollment(
        @GetStudent() student: ReqStudentInfo,
        @Param() courseEnrollmentDto: CourseEnrollmentDto,
    ): Promise<Enrollment> {
        return this.enrollmentService.courseEnrollment(student.studentId, courseEnrollmentDto.courseId);
    }

    @Delete('course/:courseId')
    @ApiOkResponse()
    @UseGuards(JwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    removeCategory(
        @GetStudent() student: ReqStudentInfo,
        @Param() courseEnrollmentDto: CourseEnrollmentDto,
    ): Promise<void> {
        return this.enrollmentService.courseUnregister(student.studentId, courseEnrollmentDto.courseId);
    }
}
