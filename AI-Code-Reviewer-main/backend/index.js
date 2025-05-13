const app=require( "./src/app")
const dotenv=require("dotenv")
dotenv.config()
const PORT=process.env.PORT

console.log("Google Gemini API Key:", process.env.GOOGLE_GEMINI_KEY);


app.listen(PORT,()=>{
    console.log("server listening on",PORT)
})