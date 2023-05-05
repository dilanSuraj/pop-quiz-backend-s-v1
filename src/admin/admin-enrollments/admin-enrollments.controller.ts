import {
    Controller,
    Post,
    Get,
    UseGuards,
    UsePipes,
    Query,
    Param,
    Put,
    Body,
    ValidationPipe,
    Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from '../admin-auth/admin-jwt-auth.guard';
import { ClassValidationPipe } from 'src/common/pipes/class-validation.pipe';
import { AdminEnrollmentsService } from './admin-enrollments.service';
import { AdminGetAllEnrollmentsResponseDto } from './dto/admin-get-all-enrollments-response.dto';
import { AdminGetEnrollmentsDto } from './dto/admin-get-enrollments.dto';
import { Enrollment } from 'src/enrollments/entity/enrollments.entity';
import { AdminUpdateEnrollmentDto } from './dto/admin-update-enrollment.dto';
import { AdminEnrollmentIdParamDto } from './dto/admin-enrollment-id-param.dto';

@ApiTags('admin/enrollments')
@ApiBearerAuth()
@Controller('admin/enrollments')
export class AdminEnrollmentsController {
    constructor(private adminEnrollmentsService: AdminEnrollmentsService) {}

    @Get()
    @ApiOkResponse({
        description: 'Enrollments',
        type: AdminGetAllEnrollmentsResponseDto,
    })
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    GetStudents(
        @Query(new ValidationPipe({ transform: true })) adminGetEnrollmentsDto: AdminGetEnrollmentsDto,
    ): Promise<AdminGetAllEnrollmentsResponseDto> {
        return this.adminEnrollmentsService.getEnrollments(
            adminGetEnrollmentsDto.skip,
            adminGetEnrollmentsDto.take,
            adminGetEnrollmentsDto.ids,
            adminGetEnrollmentsDto.sortKey,
            adminGetEnrollmentsDto.sortOrder,
            adminGetEnrollmentsDto.status,
            adminGetEnrollmentsDto.courseKey,
        );
    }

    @Get(':enrollmentId')
    @ApiOkResponse({
        description: 'Enrollment',
        type: Enrollment,
    })
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    GetStudentById(@Param() adminEnrollmentDto: AdminEnrollmentIdParamDto): Promise<Enrollment> {
        return this.adminEnrollmentsService.getEnrollmentById(adminEnrollmentDto.enrollmentId);
    }

    @Put(':enrollmentId')
    @ApiOkResponse()
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    updateUser(
        @Param() adminEnrollmentDto: AdminEnrollmentIdParamDto,
        @Body() adminUpdateEnrollmentDto: AdminUpdateEnrollmentDto,
    ): Promise<void> {
        return this.adminEnrollmentsService.updateEnrollment(adminEnrollmentDto.enrollmentId, adminUpdateEnrollmentDto);
    }
}
