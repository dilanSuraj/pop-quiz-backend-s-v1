import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CourseService } from './course.service';
import { Course } from './entity/course.entity';
import { ClassValidationPipe } from 'src/common/pipes/class-validation.pipe';
import { CourseFilterDto } from './dto/courses-filter.dto';
import { GetAvailableCoursesResponseDto } from './dto/get-available-courses-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetCourseDto } from './dto/get-course.dto';

@ApiTags('course')
@ApiBearerAuth()
@Controller('course')
export class CourseController {
    constructor(private courseService: CourseService) {}

    @Get()
    @ApiOkResponse({
        description: 'Courses',
        type: GetAvailableCoursesResponseDto,
    })
    @UseGuards(JwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    getAvailableCourses(
        @Query() courseFilterDto: CourseFilterDto,
    ): Promise<GetAvailableCoursesResponseDto> {
        return this.courseService.getAll(
            courseFilterDto.skip,
            courseFilterDto.take,
            courseFilterDto.courseName
        );
    }

    @Get(':courseId')
    @ApiOkResponse({
        description: 'Course',
        type: Course,
    })
    @UseGuards(JwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    getCourseId(@Param() getCourseDto: GetCourseDto): Promise<Course> {
        return this.courseService.getCourseById(getCourseDto.courseId);
    }
}
