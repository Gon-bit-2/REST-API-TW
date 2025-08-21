import express, { Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'
const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(compression())
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
