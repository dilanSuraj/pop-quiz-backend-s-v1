import { IsString, IsEmail, IsNotEmpty, Length, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiProperty()
    @IsEmail({}, { message: 'Please enter a valid email address' })
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(5, 100)
    password: string;
}
