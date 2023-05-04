import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CheckExistenceResponseDto {
    @ApiProperty()
    exists: boolean;

    @ApiPropertyOptional()
    studentId?: string;

    @ApiPropertyOptional()
    studentName?: string;
}
