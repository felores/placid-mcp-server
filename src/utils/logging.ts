export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

export interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export class Logger {
  constructor(private context: string = "PlacidMCP") {}

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): LogMessage {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: {
        ...context,
        service: this.context,
      },
    };
  }

  private log(message: LogMessage): void {
    // In production, you might want to send this to a logging service
    const formattedMessage = `[${message.timestamp}] ${message.level} [${this.context}]: ${message.message}`;
    
    // Only log to stderr to avoid interfering with MCP protocol on stdout
    console.error(formattedMessage);
    
    if (message.context && Object.keys(message.context).length > 0) {
      console.error("Context:", message.context);
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log(this.formatMessage(LogLevel.DEBUG, message, context));
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(this.formatMessage(LogLevel.INFO, message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log(this.formatMessage(LogLevel.WARN, message, context));
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log(
      this.formatMessage(LogLevel.ERROR, message, {
        ...context,
        error: error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : undefined,
      })
    );
  }
}

// Export a default logger instance
export const logger = new Logger();