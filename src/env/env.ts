export const environment = () => ({
  // ---------------------------------------------------------------
  // APP
  appPort: process.env.APP_PORT,
  appName: process.env.APP_NAME,
  // ---------------------------------------------------------------
  // DATABASE
  databaseUri: process.env.DATABASE_URI,
  // ---------------------------------------------------------------
  //  REDIS
  redisProductsDbUrl: process.env.REDIS_PRODUCTS_DB_URL,
  redisProductsDbName: process.env.REDIS_PRODUCTS_DB_NAME,
});
