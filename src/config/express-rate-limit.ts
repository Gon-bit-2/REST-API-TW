import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 60 * 1000, // time
  limit: 60, // Limit each IP to 100 requests per `window`
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: {
    error: 'You have sent too many request  in given amount of time. Please try again later '
  }
})

// Apply the rate limiting middleware to all requests.
export default limiter
