import { Controller, Post, UseGuards, Body, UsePipes, Get, Query, Req, Redirect } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { ClassValidationPipe } from '../common/pipes/class-validation.pipe';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { SignUpDto } from './dto/signup.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @ApiCreatedResponse({
        description: 'access tokens',
        type: LoginResponseDto,
    })
    @UseGuards(LocalAuthGuard)
    @UsePipes(ClassValidationPipe)
    localLogin(@Body() loginDto: LoginDto, @Req() req: any): Promise<LoginResponseDto> {
        return this.authService.login(req.student, loginDto.email);
    }

    @Post('signup')
    @ApiCreatedResponse({
        description: 'Student info',
        type: LoginResponseDto,
    })
    @UsePipes(ClassValidationPipe)
    localSignUp(@Body() signUpDto: SignUpDto): Promise<LoginResponseDto> {
        return this.authService.signUp(signUpDto.email, signUpDto.name, signUpDto.password);
    }
}
