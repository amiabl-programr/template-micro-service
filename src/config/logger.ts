import type { LoggerOptions } from "pino";

const isDevelopment = process.env.NODE_ENV !== "production";

export const loggerOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),
};

if (isDevelopment) {
  loggerOptions.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  };
}
