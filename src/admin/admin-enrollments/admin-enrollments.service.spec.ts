import { Test, TestingModule } from '@nestjs/testing';
import { AdminEnrollmentsService } from './admin-enrollments.service';

describe('AdminEnrollmentsService', () => {
    let service: AdminEnrollmentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AdminEnrollmentsService],
        }).compile();

        service = module.get<AdminEnrollmentsService>(AdminEnrollmentsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
