import express from 'express'
import objetoRoutes from './routes/objetoRoutes.js'
import errorHandler from './handlers/errorHandler.js'

const app = express()

app.use(express.json())

app.use('/api/objetos', objetoRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`)
})