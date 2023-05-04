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
import { AdminGetStudentsResponseDto } from './dto/admin-get-students-response.dto';
import { AdminJwtAuthGuard } from '../admin-auth/admin-jwt-auth.guard';
import { ClassValidationPipe } from 'src/common/pipes/class-validation.pipe';
import { AdminStudentsService } from './admin-students.service';
import { AdminGetStudentsDto } from './dto/admin-get-students.dto';
import { Student } from 'src/student/entity/student.entity';
import { AdminUpdateStudentDto } from './dto/admin-update-student.dto';
import { AdminStudentIdDto } from './dto/admin-student-id.dto';

@ApiTags('admin/students')
@ApiBearerAuth()
@Controller('admin/students')
export class AdminStudentsController {
    constructor(private adminStudentsService: AdminStudentsService) {}

    @Get()
    @ApiOkResponse({
        description: 'Students',
        type: AdminGetStudentsResponseDto,
    })
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    GetStudents(
        @Query(new ValidationPipe({ transform: true })) adminGetStudentsDto: AdminGetStudentsDto,
    ): Promise<AdminGetStudentsResponseDto> {
        return this.adminStudentsService.getStudents(
            adminGetStudentsDto.skip,
            adminGetStudentsDto.take,
            adminGetStudentsDto.ids,
            adminGetStudentsDto.email,
            adminGetStudentsDto.name,
            adminGetStudentsDto.sortKey,
            adminGetStudentsDto.sortOrder,
        );
    }

    // @Post()
    // @ApiCreatedResponse({
    //     description: 'Created user id',
    //     type: AdminCreateUserResponseDto,
    // })
    // @UseGuards(AdminJwtAuthGuard)
    // @UsePipes(ClassValidationPipe)
    // createUser(@Body() adminCreateUserDto: AdminCreateUserDto): Promise<AdminCreateUserResponseDto> {
    //     return this.adminStudentsService.createUser(adminCreateUserDto);
    // }

    @Get(':studentId')
    @ApiOkResponse({
        description: 'Student',
        type: Student,
    })
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    GetStudentById(@Param() adminStudentIdDto: AdminStudentIdDto): Promise<Student> {
        return this.adminStudentsService.getStudentById(adminStudentIdDto.studentId);
    }

    @Put(':studentId')
    @ApiOkResponse()
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    updateUser(@Param() adminStudentIdDto: AdminStudentIdDto, @Body() adminUpdateStudentDto: AdminUpdateStudentDto): Promise<void> {
        return this.adminStudentsService.updateStudent(adminStudentIdDto.studentId, adminUpdateStudentDto);
    }
}
