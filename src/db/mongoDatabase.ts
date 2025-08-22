import mongoose from 'mongoose'
import { countConnection } from '~/utils/countConnection'

const uri = `mongodb+srv://${process.env.MONGO_DB_NAME}:${process.env.MONGO_DB_PASSWORD}@blog-api.pvg58sk.mongodb.net/BlogApi`
class MongoDB {
  constructor() {
    this.connect()
  }
  async connect() {
    try {
      await mongoose.connect(uri)
      countConnection()
      console.log(`Connected MongoDB successfully`)
    } catch (error) {
      console.log('Connected Failed ', error)
    }
  }
}
const mongoDB = new MongoDB()
export default mongoDB
