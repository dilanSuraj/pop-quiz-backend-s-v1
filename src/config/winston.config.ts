import { WinstonModuleOptions, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import * as config from 'config';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const logConfig = config.get<{
    logToFile: boolean;
    logFile: string;
    logDirectory: string;
    maxSize: string;
    maxFiles: string;
}>('logger');

const transports: any[] = logConfig.logToFile
    ? [
          new DailyRotateFile({
              filename: logConfig.logFile,
              datePattern: 'YYYY-MM-DD',
              zippedArchive: true,
              maxSize: logConfig.maxSize,
              maxFiles: logConfig.maxFiles,
              dirname: logConfig.logDirectory,
              format: winston.format.combine(
                  winston.format.timestamp(),
                  nestWinstonModuleUtilities.format.nestLike(),
                  winston.format.uncolorize(),
              ),
          }),
      ]
    : [
          new winston.transports.Console({
              format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike()),
          }),
      ];

export const winstonConfig: WinstonModuleOptions = {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transports,
};
