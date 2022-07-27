export type LoggingFunction = (message: string) => void

export type Logger = {
    debug: LoggingFunction,
    info: LoggingFunction,
    error: LoggingFunction,
}

function time() {
    return new Date().toISOString()
}

const showDebug = true

export function log(scope: string): Logger {
    return {
        debug: (message) => {
            if (showDebug) {
                console.log(`[${time()}][${scope}][DEBUG]${message}`)
            }
        },
        info: (message) => console.log(`[${time()}][${scope}][INFO]${message}`),
        error: (message) => console.error(`[${time()}][${scope}][ERROR]${message}`)
    }
}