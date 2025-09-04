'use strict'
import { countConnection } from '~/utils/countConnection'
import 'dotenv/config'
import mongoose from 'mongoose'
import { clientOptions } from '~/config/optionsDB'
import userModel from '~/model/schema/user.model'
import { logger } from '~/log/logger'
import keyTokenModel from '~/model/schema/keyToken.model'
import blogModel from '~/model/schema/blog.model'
const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@blog-api.pvg58sk.mongodb.net/`
class MongoDB {
  constructor() {
    this.connect()
  }
  async connect(): Promise<void> {
    try {
      await mongoose.connect(uri, clientOptions)
      countConnection()
      logger.info(`Connected MongoDB successfully`)
    } catch (error) {
      logger.error('Connected Failed ', error)
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

  get user() {
    return userModel
  }
  get token() {
    return keyTokenModel
  }
  get blog() {
    return blogModel
  }
}
const mongoDB = new MongoDB()
export default mongoDB
