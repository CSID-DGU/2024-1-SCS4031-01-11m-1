import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MemberEntity } from './member.entity';

export const Member = createParamDecorator((data, ctx: ExecutionContext): MemberEntity => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});