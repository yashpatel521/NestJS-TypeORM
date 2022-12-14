import { BadRequestException, Controller, Get, Post } from "@nestjs/common";
import { Body } from "@nestjs/common/decorators";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { message } from "../errorLogging/errorMessage";
import { Roles } from "../constants/constants";
import { modulesEnum } from "../constants/types";
import { CreateModuleDto } from "./dto/create-module.dto";
import { Modules } from "./entities/module.entity";
import { ModuleService } from "./module.service";

@ApiTags("Module")
@Controller("module")
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(modulesEnum.module)
  async createModule(@Body() moduleData: CreateModuleDto): Promise<Modules[]> {
    const checkModuleName = await this.moduleService.findByName(
      moduleData.name
    );
    if (checkModuleName) {
      throw new BadRequestException(message.moduleAlreadyExists);
    }
    return await this.moduleService.create(moduleData);
  }
}
