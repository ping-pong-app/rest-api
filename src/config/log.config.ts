import pino, { Logger as PinoLogger } from "pino";
import expressPino, { HttpLogger } from "express-pino-logger";


export namespace Logger {
    export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";
    export const LogLevel = {
        FATAL: "fatal" as LogLevel,
        ERROR: "error" as LogLevel,
        WARN: "warn" as LogLevel,
        INFO: "info" as LogLevel,
        DEBUG: "debug" as LogLevel,
        TRACE: "trace" as LogLevel
    };
    
    export function parseLogLevel(logLevel: string): LogLevel {
        const level = Object.keys(LogLevel).find(levelKey => (LogLevel as any)[levelKey] === logLevel);
        if (level) {
            return (LogLevel as any)[level];
        }
        throw new Error("LogLevel type mismatch!");
    }
}

export class LogConfig {
    
    private static instance: PinoLogger;
    
    public static initialize() {
        const {APP_LOG_LEVEL = "info"} = process.env;
        
        const logLevel = Logger.parseLogLevel(APP_LOG_LEVEL);
        console.log(`Initializing logger implemented by Pino... Log level: ${logLevel}`);
        LogConfig.instance = pino({
            level: logLevel,
            redact: [
                "req.headers.authorization"
            ]
        });
        console.log("Logger component initialized!");
    }
    
    public static getLoggerMiddleware(): HttpLogger {
        LogConfig.initialize();
        return expressPino({
            logger: LogConfig.instance
        });
    }
    
    public static getInstance(): PinoLogger {
        return LogConfig.instance;
    }
}
