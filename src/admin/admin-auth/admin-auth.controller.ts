import { Controller, Post, UsePipes, Body } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { AdminLoginResponseDto } from './dto/admin-login-response.dto';
import { ClassValidationPipe } from 'src/common/pipes/class-validation.pipe';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminAuthService } from './admin-auth.service';

@ApiTags('admin/auth')
@Controller('admin/auth')
export class AdminAuthController {
    constructor(private authService: AdminAuthService) {}

    @Post('login')
    @ApiCreatedResponse({
        description: 'Admin login response',
        type: AdminLoginResponseDto,
    })
    @UsePipes(ClassValidationPipe)
    login(@Body() adminLoginDto: AdminLoginDto): Promise<AdminLoginResponseDto> {
        return this.authService.login(adminLoginDto.username, adminLoginDto.password);
    }
}
