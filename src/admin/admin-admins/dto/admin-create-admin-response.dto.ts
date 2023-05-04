import { ApiProperty } from '@nestjs/swagger';

export class AdminCreateAdminResponseDto {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    username?: string;
}
