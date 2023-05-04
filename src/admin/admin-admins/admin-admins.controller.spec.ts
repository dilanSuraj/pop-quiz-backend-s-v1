import { Test, TestingModule } from '@nestjs/testing';
import { AdminAdminsController } from './admin-admins.controller';

describe('AdminAdmins Controller', () => {
    let controller: AdminAdminsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminAdminsController],
        }).compile();

        controller = module.get<AdminAdminsController>(AdminAdminsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
