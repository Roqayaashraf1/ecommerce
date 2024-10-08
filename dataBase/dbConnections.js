import mongoose from "mongoose"
export const dbConnection = ()=>{
    mongoose.set('strictQuery', false)
mongoose.connect('mongodb://127.0.0.1:27017/Ecommerce').then(()=>{
    console.log('database connceted')
}).catch((err)=>{
    console.log('not connected')
})
}