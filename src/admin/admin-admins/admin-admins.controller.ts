import { Controller, Post, UsePipes, Body, UseGuards, Delete, Get, Query, ValidationPipe, Param } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ClassValidationPipe } from 'src/common/pipes/class-validation.pipe';
import { AdminJwtAuthGuard } from '../admin-auth/admin-jwt-auth.guard';
import { AdminResetPasswordDto } from '../admin-auth/dto/admin-reset-password.dto';
import { ReqAdminInfo } from '../admin-auth/interfaces/req-admin-info.interface';
import { AdminAdminsService } from './admin-admins.service';
import { AdminCreateAdminResponseDto } from './dto/admin-create-admin-response.dto';
import { AdminCreateAdminDto } from './dto/admin-create-admin.dto';
import { AdminGetAdminsResponseDto } from './dto/admin-get-admins-responose.dto';
import { AdminGetAdminsDto } from './dto/admin-get-admins.dto';
import { AdminRemoveAdminDto } from './dto/admin-remove-admin.dto';
import { Admin } from './entity/admin.entity';

@ApiTags('admin/admins')
@Controller('admin/admins')
export class AdminAdminsController {
    constructor(private adminAdminsService: AdminAdminsService) {}

    @Get()
    @ApiOkResponse({
        description: 'Admins',
        type: AdminGetAdminsResponseDto,
    })
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    getAdmins(
        @Query(new ValidationPipe({ transform: true })) adminGetAdminsDto: AdminGetAdminsDto,
    ): Promise<AdminGetAdminsResponseDto> {
        return this.adminAdminsService.getAdmins(
            adminGetAdminsDto.skip,
            adminGetAdminsDto.take,
            adminGetAdminsDto.userId,
            adminGetAdminsDto.username,
            adminGetAdminsDto.sortKey,
            adminGetAdminsDto.sortOrder,
        );
    }

    @Get('me')
    @ApiOkResponse({
        description: 'Admin',
        type: Admin,
    })
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    getMyProfile(@GetUser() admin: ReqAdminInfo): Promise<Admin> {
        return this.adminAdminsService.getAdminById(admin.userId);
    }

    @Get(':userId')
    @ApiOkResponse({
        description: 'Admin',
        type: Admin,
    })
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    getAdminById(@Param() admin: ReqAdminInfo): Promise<Admin> {
        return this.adminAdminsService.getAdminById(admin.userId);
    }

    @Post()
    @ApiCreatedResponse({
        description: 'Admin info',
        type: AdminCreateAdminResponseDto,
    })
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    createAdmin(@Body() adminCreateAdminDto: AdminCreateAdminDto): Promise<AdminCreateAdminResponseDto> {
        return this.adminAdminsService.createAdmin(adminCreateAdminDto);
    }

    @Post('me/password')
    @ApiBearerAuth()
    @ApiCreatedResponse()
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    resetMyPassword(
        @GetUser() admin: ReqAdminInfo,
        @Body() adminResetPasswordDto: AdminResetPasswordDto,
    ): Promise<void> {
        return this.adminAdminsService.resetMyPassword(
            admin.userId,
            adminResetPasswordDto.oldPassword,
            adminResetPasswordDto.newPassword,
        );
    }

    @Post(':userId/password')
    @ApiBearerAuth()
    @ApiCreatedResponse()
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    resetAdminPassword(
        @Param() admin: ReqAdminInfo,
        @Body() adminResetPasswordDto: AdminResetPasswordDto,
    ): Promise<void> {
        return this.adminAdminsService.resetAdminPassword(admin.userId, adminResetPasswordDto.newPassword);
    }

    @Delete(':userId')
    @ApiOkResponse()
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    removeAdmin(@Param() adminRemoveAdminDto: AdminRemoveAdminDto): Promise<void> {
        return this.adminAdminsService.removeAdmin(adminRemoveAdminDto);
    }
}
