import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CheckExistenceDto {
    @ApiProperty()
    @IsEmail({}, { message: 'Please enter a valid email address' })
    email: string;
}
