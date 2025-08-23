import express, { Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'
import limiter from '~/config/express-rate-limit'
import mongoDB from '~/db/mongoDatabase'
import { logger } from '~/log/logger'
const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(compression())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(limiter)
//connect mongo
mongoDB.connect()
//logger
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

//handle shutdown server
const handleShutdownServer = async () => {
  try {
    await mongoDB.disConnect()
    logger.warn('Server Shutdown')
    process.exit(0)
  } catch (error) {
    logger.error('Error during server shutdown', error)
  }
}
process.on('SIGTERM', handleShutdownServer)
process.on('SIGINT', handleShutdownServer)
