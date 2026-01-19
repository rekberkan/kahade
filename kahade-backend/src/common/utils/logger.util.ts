import { Logger as NestLogger } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, context, trace }) => {
    return `${timestamp} [${context || 'Application'}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
  }),
);

export class Logger extends NestLogger {
  private static winstonLogger: winston.Logger;

  constructor(context?: string) {
    super(context);
    if (!Logger.winstonLogger) {
      Logger.initializeWinston();
    }
  }

  private static initializeWinston() {
    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: consoleFormat,
      }),
    ];

    // File transport for production
    if (process.env.NODE_ENV === 'production') {
      transports.push(
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: logFormat,
        }),
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
          format: logFormat,
        }),
      );
    }

    Logger.winstonLogger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      transports,
      exitOnError: false,
    });
  }

  log(message: any, context?: string) {
    super.log(message, context);
    Logger.winstonLogger.info(message, { context: context || this.context });
  }

  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context);
    Logger.winstonLogger.error(message, {
      context: context || this.context,
      trace,
    });
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
    Logger.winstonLogger.warn(message, { context: context || this.context });
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
    Logger.winstonLogger.debug(message, { context: context || this.context });
  }

  verbose(message: any, context?: string) {
    super.verbose(message, context);
    Logger.winstonLogger.verbose(message, { context: context || this.context });
  }
}
