import { Test, TestingModule } from '@nestjs/testing';
import { AdminServicesService } from './admin-courses.service';

describe('AdminServicesService', () => {
    let service: AdminServicesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AdminServicesService],
        }).compile();

        service = module.get<AdminServicesService>(AdminServicesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
