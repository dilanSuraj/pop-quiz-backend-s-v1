import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginResponseDto {
    @ApiProperty()
    studentId: string;

    @ApiPropertyOptional()
    studentAccessToken?: string;
}
