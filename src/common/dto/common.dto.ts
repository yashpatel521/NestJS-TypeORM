import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { fileUploadType } from "../common.constants";

export class fileUploadDto {
  @ApiProperty({ required: true, example: "user" })
  @IsString()
  type: fileUploadType;
}
