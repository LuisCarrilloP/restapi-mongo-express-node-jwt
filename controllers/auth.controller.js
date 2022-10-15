import { User } from '../models/User.js'
import jwt from 'jsonwebtoken'

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
    const token = jwt.sign({ uid: user.id }, process.env.JWT_SECRET)


    res.json({ token })

  } catch (error) {
    console.log(error);    
    return res.status(500).json({ error: 'Error de servidor' })
  }
}
