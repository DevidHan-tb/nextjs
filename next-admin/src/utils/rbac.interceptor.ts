import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { CallHandler, NestInterceptor } from '@nestjs/common/interfaces';
import { Observable } from 'rxjs';

// 创建一个函数式的拦截器
// @Injectable()
export function RbacInterceptor(role: number): NestInterceptor {
    return {
        intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
            const request = context.getArgByIndex(1).req;
            if (request.user.role !== role) {
                throw new ForbiddenException('对不起，您没有权限访问');
            }
            return next.handle();
        }
    };
}