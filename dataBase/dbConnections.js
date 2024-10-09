import mongoose from "mongoose"
export const dbConnection = ()=>{
    mongoose.set('strictQuery', false)
mongoose.connect('mongodb+srv://roqayaashraf25:UZhrp4LLF2wVbnAm@cluster0.8y9xd.mongodb.net/').then(()=>{
    console.log('database connceted')
}).catch((err)=>{
    console.log('not connected')
})
}