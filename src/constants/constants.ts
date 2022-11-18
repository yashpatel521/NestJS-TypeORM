import { SetMetadata } from "@nestjs/common";
import * as dotenv from "dotenv";
import { DataSourceOptions } from "typeorm";

dotenv.config();
const ENV = process.env;

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const PrinLog = (message: string, color: string = logColor.FgWhite) => {
  if (ENV.LOGENABLE === "true") {
    if (typeof message == "string") {
      message = setColor(message, color);
      console.log(message);
    } else {
      console.log(JSON.stringify(message, null, 2));
    }
  }
};

export const setColor = (
  string: string | string[] | undefined,
  color: string
) => {
  return color + string + logColor.Reset;
};

export const roles = ["admin", "customer"];
export type rolesType = "admin" | "customer";
export enum rolesEnum {
  admin = "admin",
  customer = "customer",
}

export const modules = ["user", "role"];
export type modulesType = "user" | "role";
export enum modulesEnum {
  user = "user",
  role = "role",
}

export const permissions = ["create", "get", "update", "delete"];
export type permissionsType = "create" | "get" | "update" | "delete";
export enum permissionsEnum {
  create = "create",
  get = "get",
  update = "update",
  delete = "delete",
}

export const DATABASE_URL = ENV.DATABASE_URL;
export const TOKEN_SECRET = ENV.TOKEN_SECRET;
export const TOKEN_EXPIRE = ENV.TOKEN_EXPIRE;
export const REFRESH_TOKEN_SECRET = ENV.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRE = ENV.REFRESH_TOKEN_EXPIRE;
export const SERVER_URL = `http://${ENV.SERVER}:${ENV.PORT}/`;

let configDB = {
  type: ENV.DB_TYPE,
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  username: ENV.DB_USERNAME,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
};

if (ENV.USE_DB === "LOCAL") {
  configDB = {
    type: ENV.LOCAL_DB_TYPE,
    host: ENV.LOCAL_DB_HOST,
    port: ENV.LOCAL_DB_PORT,
    username: ENV.LOCAL_DB_USERNAME,
    password: ENV.LOCAL_DB_PASSWORD,
    database: ENV.LOCAL_DB_NAME,
  };
}

export const DATABSE_URL = `${configDB.type}://${configDB.username}:${configDB.password}@${configDB.host}:${configDB.port}/${configDB.database}`;

type dbType = "mysql" | "postgres";

export const config: DataSourceOptions = {
  type: configDB.type as dbType,
  host: configDB.host,
  port: +configDB.port as number,
  username: configDB.username,
  password: configDB.password,
  database: configDB.database,
  entities: [],
  synchronize: ENV.SYNC_DB === "true",
  logging: ENV.LOGENABLE === "true",
};

export const logColor = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",
  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",
  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
};

export const deleteSuccess = {
  statusCode: 200,
  success: true,
};
