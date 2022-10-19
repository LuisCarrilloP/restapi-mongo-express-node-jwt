import 'dotenv/config'
import './database/connectDB.js'
import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js'
import linkRouter from './routes/link.route.js'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/links', linkRouter)

//ejemplo de login/token
app.use(express.static('public'))

const PORT = process.env.PORT || 5001

app.listen(PORT, () => console.log('Running in http://localhost:' + PORT))