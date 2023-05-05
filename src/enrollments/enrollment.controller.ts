import { Controller, Get, Param, Query, UseGuards, UsePipes } from '@nestjs/common';
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
        @Query() enrollmentFilterDto: EnrollmentFilterDto,
    ): Promise<GetAllEnrollmentsByStudentResponseDto> {
        return this.enrollmentService.getAllEnrollments(
            enrollmentFilterDto.studentId,
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
    getEnrollmentId(
        @GetStudent() student: ReqStudentInfo,
        @Param() getEnrollmentDto: EnrollmentIdParamDto,
    ): Promise<Enrollment> {
        return this.enrollmentService.getEnrollmentByIdAndStudent(getEnrollmentDto.enrollmentId, student.studentId);
    }
}
