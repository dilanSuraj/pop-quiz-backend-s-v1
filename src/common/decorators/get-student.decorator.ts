import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ReqStudentInfo } from 'src/auth/interfaces/req-student-info.interface';

export const GetStudent = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): ReqStudentInfo => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
