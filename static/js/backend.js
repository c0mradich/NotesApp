import dotenv from "dotenv"
dotenv.config()
const port = provess.env.port
console.log(port)
async function sendNote(note){
    const res = await fetch(`http://localhost:${port}`, {
        body: {

        }
    })
    if ( !res.json().success ){
        console.log(res.json().err)
    }
}