import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './interfaces/interface';


export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest();
        console.log(request.user)
        return request.user;
    },
);