import { ConnectOptions } from 'mongoose'

const clientOptions: ConnectOptions = {
  dbName: 'blog-db',
  appName: 'Blog API',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  }
}
export { clientOptions }
