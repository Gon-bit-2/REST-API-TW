import express, { Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'
import limiter from '~/config/express-rate-limit'
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
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
