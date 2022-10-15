import mongoose from 'mongoose'

try{
  mongoose.connect(process.env.URL_MONGO)
  console.log("Connected to DB 👍🏻");
}catch (error){
  console.log('Error de conexión am mongoDB' + '====>' + error)
}