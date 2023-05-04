import { Test, TestingModule } from '@nestjs/testing';
import { AdminAdminsService } from './admin-admins.service';

describe('AdminAdminsService', () => {
    let service: AdminAdminsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AdminAdminsService],
        }).compile();

        service = module.get<AdminAdminsService>(AdminAdminsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
