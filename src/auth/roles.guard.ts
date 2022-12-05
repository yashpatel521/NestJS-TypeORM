import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_MODULE_KEY } from "../constants/constants";
import { modulesType } from "../constants/types";
import { message } from "../errorLogging/errorMessage";
import { PermissionService } from "../permission/permission.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly moduleService: PermissionService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const module = this.reflector.get<modulesType>(
      IS_MODULE_KEY,
      context.getHandler()
    );

    if (!module) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role.name;
    let access = true;
    access = await this.moduleService.checkPermissionByRole(
      userRole,
      module,
      request.method
    );

    if (!access) {
      throw new UnauthorizedException({
        statusCode: 403,
        message: message.notAuthorized,
      });
    }
    return access;
  }
}
