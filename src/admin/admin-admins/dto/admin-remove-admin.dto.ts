import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AdminRemoveAdminDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    userId: string;
}
