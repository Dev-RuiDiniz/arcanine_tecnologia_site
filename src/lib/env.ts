type VercelEnvironment = "development" | "preview" | "production";

const getVercelEnvironment = (): VercelEnvironment => {
  const env = process.env.VERCEL_ENV;
  if (env === "production" || env === "preview") {
    return env;
  }
  return "development";
};

export const resolveDatabaseUrl = (): string => {
  const environment = getVercelEnvironment();

  if (environment === "production") {
    return process.env.DATABASE_URL_PROD || process.env.DATABASE_URL || "";
  }

  if (environment === "preview") {
    return process.env.DATABASE_URL_PREVIEW || process.env.DATABASE_URL || "";
  }

  return process.env.DATABASE_URL_DEV || process.env.DATABASE_URL || "";
};
