import { IBlog } from '~/model/schema/blog.model'

export type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>
