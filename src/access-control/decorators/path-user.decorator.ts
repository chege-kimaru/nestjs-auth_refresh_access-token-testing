import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const PathUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.User;
    },
);
