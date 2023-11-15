import * as Joi from 'joi';

export interface EnvironmentSetup {
  APP_PORT: number;
  APP_NAME: string;
  DATABASE_URI: string;
  REDIS_PRODUCTS_DB_URL: string;
  REDIS_PRODUCTS_DB_NAME: string;
  REDIS_SESSIONS_DB_URL: string;
  REDIS_SESSIONS_DB_NAME: string;
}

export const JoiValidationSchema = Joi.object<EnvironmentSetup>({
  // --------------------------------------------------------------
  // APPLICATION
  APP_PORT: Joi.number().required().min(1).max(65535),
  APP_NAME: Joi.string().required(),
  DATABASE_URI: Joi.string().required(),
  // ------------------------------------------------------------------------------------
  REDIS_PRODUCTS_DB_URL: Joi.string().required(),
  REDIS_PRODUCTS_DB_NAME: Joi.string().required(),
});
