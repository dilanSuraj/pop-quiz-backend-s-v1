import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginResponseDto {
    @ApiProperty()
    token: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    username?: string;

    @ApiProperty()
    role: string;
}
