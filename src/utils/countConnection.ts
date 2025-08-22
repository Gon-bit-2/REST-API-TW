import mongoose from 'mongoose'

const countConnection = () => {
  const numConnection = mongoose.connections.length
  console.log(`Number of connection::${numConnection} `)
}
export { countConnection }
