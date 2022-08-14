import * as winston from "winston"
import { config } from "./config"

// Exports a logger, which can be used in all Scripts
export const logger = winston.createLogger({
    level: config.log.level,
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: `${config.log.path}/error.log`,
            level: "error",
        }),
        new winston.transports.File({
            filename: `${config.log.path}/debug.log`,
            level: "debug",
        }),
        new winston.transports.File({
            filename: `${config.log.path}/console.log`,
        }),
        new winston.transports.Console(), // The console gets the loglevel specified with the property level
    ],
    exitOnError: false,
})
