import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AdminReqUserInfo } from 'src/admin/admin-auth/interfaces/admin-req-user-info.interface';

export const GetAdminUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): AdminReqUserInfo => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
