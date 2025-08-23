import winston, { level } from 'winston'
import 'dotenv/config'
const { colorize, combine, json, errors, printf, align, timestamp } = winston.format

const transports: winston.transport[] = []

if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }), //add color to log
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }), //add timestamp to log
        align(),
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta)}` : ' '
          return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`
        })
      )
    })
  )
}
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  silent: process.env.NODE_ENV === 'test' //disable logging in test env
})
export { logger }
