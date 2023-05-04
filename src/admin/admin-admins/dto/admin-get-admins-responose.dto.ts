import { ApiProperty } from '@nestjs/swagger';
import { Admin } from '../entity/admin.entity';

export class AdminGetAdminsResponseDto {
    @ApiProperty()
    admins: Admin[];

    @ApiProperty()
    totalCount: number;
}
