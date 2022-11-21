import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_MODULE_KEY, modulesType } from "../constants/constants";
import { message } from "../errorLogging/errorMessage";
import { ModuleService } from "../module/module.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly moduleService: ModuleService
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
    access = await this.moduleService.findPermissionByRole(
      userRole,
      module,
      request.method.toLowerCase()
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
