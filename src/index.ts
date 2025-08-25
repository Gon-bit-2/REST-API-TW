import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'
import limiter from '~/config/express-rate-limit'
import mongoDB from '~/db/mongoDatabase'
import { logger } from '~/log/logger'
import routes from '~/routes'
import 'dotenv/config'
import { errorHandler } from '~/middleware/error.middleware'
const app = express()
const PORT = process.env.PORT || 3000
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
//
app.use(limiter)
//connect mongo
mongoDB.connect()
//routes
app.use('/', routes)
//error
app.use(errorHandler)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
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
