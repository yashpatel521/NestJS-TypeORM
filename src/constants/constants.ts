import { SetMetadata } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as dotenv from 'dotenv';
import { User } from 'src/user/dto/user.entity';
import { DataSourceOptions } from 'typeorm';

dotenv.config();

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const DATABASE_URL = process.env.DATABASE_URL;
export const TOKEN_SECRET = process.env.TOKEN_SECRET;
export const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const config: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '101010',
  database: 'nest',
  entities: [],
  synchronize: true,
};

const LOGENABLE = process.env.LOGENABLE;
export const QUERYLOG: (Prisma.LogLevel | Prisma.LogDefinition)[] =
  LOGENABLE === 'true' ? ['query', 'error'] : [];

export const logColor = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',
  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',
  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m',
};
