import {
    Controller,
    Put,
    UseGuards,
    UsePipes,
    Param,
    Body,
    Get,
    Query,
    ValidationPipe,
    Post,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiCreatedResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from '../admin-auth/admin-jwt-auth.guard';
import { ClassValidationPipe } from 'src/common/pipes/class-validation.pipe';
import { AdminGetCoursesResponseDto } from './dto/admin-get-courses-response.dto';
import { AdminCoursesService } from './admin-courses.service';
import { Course } from 'src/course/entity/course.entity';
import { AdminGetCoursesDto } from './dto/admin-get-courses.dto';
import { AdminCourseIdDto } from './dto/admin-course-id.dto';
import { AdminCreateCourseDto } from './dto/admin-create-course.dto';
import { AdminUpdateCourseDto } from './dto/admin-update-course.dto';
import { GetAdminUser } from 'src/common/decorators/get-admin-user.decorator';
import { ReqAdminInfo } from '../admin-auth/interfaces/req-admin-info.interface';

@ApiTags('admin/courses')
@ApiBearerAuth()
@Controller('admin/courses')
export class AdminCoursesController {
    constructor(private adminCoursesService: AdminCoursesService) {}

    @Get()
    @ApiOkResponse({
        description: 'Courses',
        type: AdminGetCoursesResponseDto,
    })
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    getCourses(
        @Query(new ValidationPipe({ transform: true })) adminGetCoursesDto: AdminGetCoursesDto,
    ): Promise<AdminGetCoursesResponseDto> {
        return this.adminCoursesService.getCourses(
            adminGetCoursesDto.skip,
            adminGetCoursesDto.take,
            adminGetCoursesDto.ids,
            adminGetCoursesDto.q,
            adminGetCoursesDto.sortKey,
            adminGetCoursesDto.sortOrder,
        );
    }

    @Post()
    @ApiCreatedResponse({
        description: 'Created Service',
        type: Course,
    })
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    createCourse(
        @GetAdminUser() reqAdminInfo: ReqAdminInfo,
        @Body() adminCreateCourseDto: AdminCreateCourseDto,
    ): Promise<Course> {
        return this.adminCoursesService.createCourse(reqAdminInfo.userId, adminCreateCourseDto);
    }

    @Get(':courseId')
    @ApiOkResponse({
        description: 'Service',
        type: Course,
    })
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    getCourseById(@Param() adminCourseIdDto: AdminCourseIdDto): Promise<Course> {
        return this.adminCoursesService.getCourseById(adminCourseIdDto.courseId);
    }

    @Put(':courseId')
    @ApiOkResponse()
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    updateCourse(
        @GetAdminUser() reqAdminInfo: ReqAdminInfo,
        @Param() adminCourseIdDto: AdminCourseIdDto,
        @Body() adminUpdateCourseDto: AdminUpdateCourseDto,
    ): Promise<void> {
        return this.adminCoursesService.updateCourse(
            reqAdminInfo.userId,
            adminCourseIdDto.courseId,
            adminUpdateCourseDto,
        );
    }
}
