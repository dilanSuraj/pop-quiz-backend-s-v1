import { Test, TestingModule } from '@nestjs/testing';
import { AdminCoursesService } from './admin-courses.service';

describe('AdminCoursesService', () => {
    let service: AdminCoursesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AdminCoursesService],
        }).compile();

        service = module.get<AdminCoursesService>(AdminCoursesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
