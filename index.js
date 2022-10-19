import 'dotenv/config'
import './database/connectDB.js'
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'

import authRouter from './routes/auth.route.js'
import linkRouter from './routes/link.route.js'
import redirectRouter from './routes/redirect.route.js'

const app = express()

const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2]

app.use(cors({
  origin: function(origin, callback){
    if(whiteList.includes(origin)){
      return callback(null, origin)
    }
    return callback("Error de CORS origin: " + origin + ". No autorizado!")
  }
}))

app.use(express.json())
app.use(cookieParser())

//ejemplo back redirect(opcional)
app.use('/', redirectRouter)

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/links', linkRouter)

//ejemplo de login/token
//app.use(express.static('public'))

const PORT = process.env.PORT || 5001

app.listen(PORT, () => console.log('Running in http://localhost:' + PORT))