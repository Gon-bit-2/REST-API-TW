'use strict'
import { model, Schema, Types } from 'mongoose'
export interface IUser extends Document {
  username: string
  email: string
  password: string
  role: 'admin' | 'user'
  firstName?: string
  lastName?: string
  socialLinks?: {
    website?: string
    facebook?: string
    instagram?: string
    x?: string
    youtube?: string
  }
}
const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const commentSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'username required'],
      unique: [true, 'username unique']
    },
    email: {
      type: String,
      required: [true, 'Email required'],
      unique: [true, 'Email unique']
    },
    password: {
      type: String,
      required: [true, 'password required'],
      unique: [true, 'password unique']
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    firstName: String,
    lastName: String,
    socialLinks: {
      website: String,
      facebook: String,
      instagram: String,
      x: String,
      youtube: String
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const userModel = model<IUser>(DOCUMENT_NAME, commentSchema)
export default userModel
