import { format, createLogger, Logger, transports } from "winston"
import { config } from "./config"

// Exports a logger, which can be used in all Scripts
export const logger: Logger = createLogger({
    level: config.log.level,
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        new transports.File({
            filename: `${config.log.path}/error.log`,
            level: "error",
        }),
        new transports.File({
            filename: `${config.log.path}/debug.log`,
            level: "debug",
        }),
        new transports.File({
            filename: `${config.log.path}/console.log`,
        }),
        new transports.Console(), // The console gets the loglevel specified with the property level
    ],
    exitOnError: false,
})

export const deploymentLogger: Logger = createLogger({
    level: config.log.level,
    format: format.combine(format.timestamp(), format.prettyPrint()),
    transports: [
        new transports.File({
            filename: `${config.log.path}/deployment.log`,
            level: "debug",
        }),
        new transports.Console(), // The console gets the loglevel specified with the property level
    ],
    exitOnError: false,
})
