import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DATABSE_URL, Public } from "./constants/constants";

@ApiTags("SERVER")
@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get()
  serverStatus() {
    return {
      server: "Server is running",
      database: DATABSE_URL,
    };
  }
}
