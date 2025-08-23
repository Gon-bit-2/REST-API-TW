'use strict'
import { countConnection } from '~/utils/countConnection'
import 'dotenv/config'
import mongoose from 'mongoose'
import { clientOptions } from '~/config/optionsDB'
const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@blog-api.pvg58sk.mongodb.net/`
class MongoDB {
  constructor() {
    this.connect()
  }
  async connect(): Promise<void> {
    try {
      await mongoose.connect(uri, clientOptions)
      countConnection()
      console.log(`Connected MongoDB successfully`)
    } catch (error) {
      console.log('Connected Failed ', error)
    }
  }
  async disConnect(): Promise<void> {
    try {
      await mongoose.disconnect()
      console.log(`DisConnect MongoDB successfully`)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      console.log('DisConnect Failed ', error)
    }
  }
}
const mongoDB = new MongoDB()
export default mongoDB
