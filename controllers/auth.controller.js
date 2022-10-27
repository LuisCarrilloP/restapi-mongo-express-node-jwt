import { User } from '../models/User.js'
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
    const { token, expiresIn } = generateToken(user.id)
    generateRefreshToken(user.id, res)

    return res.status(201).json({ token, expiresIn })
  } catch (error) {
    return res.status(403).json({ error: error.message })
  }
}

export const login = async(req, res) => {
  try {
    const { email, password } = req.body

    let user = await User.findOne({ email })
    if(!user) return res.status(403).json({ error: "Invalid credentials(usuario borrar!)" }) //Usuario no encontrado

    const respuestaPassword = await user.comparePassword(password)
    if(!respuestaPassword){
      return res.status(403).json({ error: "Invalid credentials(password borrar!)" }) //Contraseña Incorrecta
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
    const { token, expiresIn } = generateToken(req.uid)
    return res.json({ token, expiresIn })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "error de server "})

  }  
}

export const logout = (req, res) => {
  res.clearCookie('refreshToken')
  res.json({ ok: true })
}
