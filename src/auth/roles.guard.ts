import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { message } from "../errorLogging/errorMessage";
import { ModuleService } from "../module/module.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly moduleService: ModuleService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    const permission = this.reflector.get<string>(
      "permission",
      context.getHandler()
    );
    const module = this.reflector.get<string>("module", context.getHandler());

    if (!roles && !permission && !module) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role.name;
    let access = true;
    if (!roles.includes(userRole)) {
      access = false;
    }

    access = await this.moduleService.findPermissionByRole(
      userRole,
      module,
      permission
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
