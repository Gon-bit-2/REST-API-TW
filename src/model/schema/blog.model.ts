'use strict'

import { model, Schema, Types } from 'mongoose'
import slugify from 'slugify'
const DOCUMENT_NAME = 'Blog'
const COLLECTION_NAME = 'Blogs'
export interface IBlog extends Document {
  title: string
  slug: string
  content: string
  banner: {
    publicId: string
    url: string
    width: number
    height: number
  }
  author: Schema.Types.ObjectId
  viewsCount: number
  likesCount: number
  commentsCount: number
  status: 'draft' | 'published'
}
const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required']
    },
    slug: {
      type: String,
      unique: [true, 'slug unique']
    },
    content: {
      type: String,
      required: [true, 'content is required']
    },
    banner: {
      publicId: {
        type: String,
        required: [true, 'publicId is required']
      },
      url: {
        type: String,
        required: [true, 'url is required']
      },
      width: {
        type: Number,
        required: [true, 'width is required']
      },
      height: {
        type: Number,
        required: [true, 'height is required']
      }
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    viewsCount: {
      type: Number,
      default: 0
    },
    likesCount: {
      type: Number,
      default: 0
    },
    commentsCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: '{VALUE} is not supported'
      },
      default: 'draft'
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)
blogSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true })
  }
  next()
})

const blogModel = model<IBlog>(DOCUMENT_NAME, blogSchema)
export default blogModel
