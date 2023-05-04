import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class LoginDto {
    @ApiProperty()
    @IsEmail({}, { message: 'Please enter a valid email address' })
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(5)
    password: string;
}
