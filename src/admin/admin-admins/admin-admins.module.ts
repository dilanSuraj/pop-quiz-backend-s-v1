import { Module } from '@nestjs/common';
import { AdminAdminsController } from './admin-admins.controller';
import { AdminAdminsService } from './admin-admins.service';

@Module({
    providers: [AdminAdminsService],
    controllers: [AdminAdminsController],
    imports: [],
    exports: [AdminAdminsService],
})
export class AdminAdminsModule {}
