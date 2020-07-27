import { Logger as PinoLogger } from "pino";
import { LogConfig, Logger as LogNamespace } from "../config/log.config";
import LogLevel = LogNamespace.LogLevel;

export class Logger {
    
    public static getLevel(): LogLevel {
        return LogConfig.getInstance().level as LogLevel;
    }
    
    public static getLogger(): PinoLogger {
        return LogConfig.getInstance();
    }
    
    public static fatal(message: string, ...args: any[]) {
        LogConfig.getInstance().fatal(message, args);
    }
    
    public static error(message: string, ...args: any[]) {
        LogConfig.getInstance().error(message, args);
    }
    
    public static warn(message: string, ...args: any[]) {
        LogConfig.getInstance().warn(message, args);
    }
    
    public static info(message: string, ...args: any[]) {
        LogConfig.getInstance().info(message, args);
    }
    
    public static debug(message: string, ...args: any[]) {
        LogConfig.getInstance().debug(message, args);
    }
    
    public static trace(message: string, ...args: any[]) {
        LogConfig.getInstance().trace(message, args);
    }
    
}
