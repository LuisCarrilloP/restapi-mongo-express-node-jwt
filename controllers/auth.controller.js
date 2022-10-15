import { User } from '../models/User.js'
import jwt from 'jsonwebtoken'
import { generateRefreshToken, generateToken } from '../utils/tokenManager.js'

export const register = async(req, res) => {
  try {
    const { email, password } = req.body

    let user = await User.findOne({ email })
    if(user) throw new Error('Email ya registrado')
    
    user = new User({
      email,
      password
    })
    await user.save()

    //Generar JWT



    return res.status(201).json({ message: 'Usuario creado' })
  } catch (error) {
    return res.status(403).json({ error: error.message })
  }
}

export const login = async(req, res) => {
  try {
    const { email, password } = req.body

    let user = await User.findOne({ email })
    if(!user) return res.status(403).json({ error: "Invalid credentials" }) //Usuario no encontrado

    const respuestaPassword = await user.comparePassword(password)
    if(!respuestaPassword){
      return res.status(403).json({ error: "Invalid credentials" }) //Contraseña Incorrecta
    }

    //Generar token JWT
    const { token, expiresIn } = generateToken(user.id)
    generateRefreshToken(user.id, res)

    return res.json({ token, expiresIn })

  } catch (error) {
    console.log(error);    
    return res.status(500).json({ error: 'Error de servidor' })
  }
}

export const infoUser = async(req, res) => {
  try {
    const user = await User.findById(req.uid).lean()
    return res.json({ email: user.email, uid: user.id })
    
  } catch (error) {
    return res.status(500).json({ error: "error de server "})
  }
}

export const refreshToken = (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken
    if(!refreshTokenCookie) throw new Error("No existe el token")

    const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH)
    const { token, expiresIn } = generateToken(uid)

    return res.json({ token, expiresIn })

  } catch (error) {
    console.log(error);

    const TokenVerificationErrors = {
      "invalid signature": "La firma del JWT no es valida",
      "jwt expired": "JWT expirado",
      "invalid token": "Token invalido",
      "No Bearer": "Utiliza formato Bearer",
      "jwt malformed": "JWT formato invalido"
    }

    return res
      .status(401)
      .send({ error: TokenVerificationErrors[error.message] })
  }  
}
