// TODO: remove nestjs references from domain
import { LogLevel } from '@nestjs/common';
import { ConfigModuleOptions } from '@nestjs/config';
import Joi from 'joi';

const WHEN_DB_URL_SET = Joi.when('DB_URL', {
  is: Joi.exist(),
  then: Joi.string().optional(),
  otherwise: Joi.string().required(),
});

export const immichAppConfig: ConfigModuleOptions = {
  envFilePath: '.env',
  isGlobal: true,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().optional().valid('development', 'production', 'staging').default('development'),
    DB_USERNAME: WHEN_DB_URL_SET,
    DB_PASSWORD: WHEN_DB_URL_SET,
    DB_DATABASE_NAME: WHEN_DB_URL_SET,
    DB_URL: Joi.string().optional(),
    LOG_LEVEL: Joi.string().optional().valid('simple', 'verbose', 'debug', 'log', 'warn', 'error').default('log'),
    MACHINE_LEARNING_PORT: Joi.number().optional(),
    MICROSERVICES_PORT: Joi.number().optional(),
    SERVER_PORT: Joi.number().optional(),
  }),
};

export function getLogLevels() {
  const LOG_LEVELS: LogLevel[] = ['verbose', 'debug', 'log', 'warn', 'error'];
  let logLevel = process.env.LOG_LEVEL || 'log';
  if (logLevel === 'simple') {
    logLevel = 'log';
  }
  const logLevelIndex = LOG_LEVELS.indexOf(logLevel as LogLevel);
  return logLevelIndex === -1 ? [] : LOG_LEVELS.slice(logLevelIndex);
}
