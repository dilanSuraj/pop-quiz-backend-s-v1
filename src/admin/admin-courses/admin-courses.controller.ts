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

@ApiTags('admin/courses')
@ApiBearerAuth()
@Controller('admin/courses')
export class AdminCoursesController {
    constructor(private adminServicesService: AdminServicesService) {}

    @Get()
    @ApiOkResponse({
        description: 'Services',
        type: AdminGetServicesResponseDto,
    })
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    getServices(
        @Query(new ValidationPipe({ transform: true })) adminGetServicesDto: AdminGetServicesDto,
    ): Promise<AdminGetServicesResponseDto> {
        return this.adminServicesService.getServices(
            adminGetServicesDto.skip,
            adminGetServicesDto.take,
            adminGetServicesDto.ids,
            adminGetServicesDto.ownerId,
            adminGetServicesDto.expertId,
            adminGetServicesDto.status,
            adminGetServicesDto.q,
            adminGetServicesDto.sortKey,
            adminGetServicesDto.sortOrder,
            adminGetServicesDto.serviceCallType,
        );
    }

    @Post()
    @ApiCreatedResponse({
        description: 'Created Service',
        type: Service,
    })
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    createService(@Body() adminCreateServiceDto: AdminCreateServiceDto): Promise<Service> {
        return this.adminServicesService.createService(adminCreateServiceDto);
    }

    @Get(':serviceId')
    @ApiOkResponse({
        description: 'Service',
        type: Service,
    })
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    getServiceById(@Param() adminServiceIdDto: AdminServiceIdDto): Promise<Service> {
        return this.adminServicesService.getServiceById(adminServiceIdDto.serviceId);
    }

    @Put(':serviceId')
    @ApiOkResponse()
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    updateService(
        @Param() adminServiceIdDto: AdminServiceIdDto,
        @Body() adminUpdateServiceDto: AdminUpdateServiceDto,
    ): Promise<void> {
        return this.adminServicesService.updateService(adminServiceIdDto.serviceId, adminUpdateServiceDto);
    }

    @Post(':serviceId/change-request')
    @ApiCreatedResponse()
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    requestServiceChanges(
        @Param() adminServiceIdDto: AdminServiceIdDto,
        @Body() adminRequestChangesDto: AdminRequestChangesDto,
    ): Promise<void> {
        return this.adminServicesService.requestServiceChanges(
            adminServiceIdDto.serviceId,
            adminRequestChangesDto.rejectReason,
        );
    }

    @Post('service-names')
    @ApiCreatedResponse()
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    createServiceNames(): Promise<void> {
        return this.adminServicesService.generateServiceNames();
    }

    @Post(':serviceId/image')
    @ApiCreatedResponse({
        description: 'URL key which can be used to access the image',
        type: UploadServiceImageResponseDto,
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'service pic',
        type: UploadServiceImageDto,
    })
    @ApiBearerAuth()
    @UseInterceptors(getFileInterceptorForField('image'))
    @UseGuards(AdminJwtAuthGuard)
    @UsePipes(ClassValidationPipe)
    uploadServicePic(
        @Param() adminUpdateServicePicDto: AdminUpdateServicePicDto,
        @UploadedFile() file: any,
    ): Promise<void> {
        return this.adminServicesService.uploadServiceImage(adminUpdateServicePicDto.serviceId, file);
    }
}
