import http from 'http'
import { hello } from './hello.js'
import { time } from 'console'
import { url } from 'inspector'
// import moment from 'moment/moment.js'


// const server = http.createServer((req, res) => {
//     res.statusCode = 200
//     res.setHeader('Content-Type', 'text/plain')
//     res.write('Hello World')
//     res.end()
// }) 

// .listen(3000)

// const server = http.createServer((req, res) => {
//     res.statusCode = 200
//     res.setHeader('Content-Type', 'applocation/json')
//     res.write(moment().calendar())
//     res.end()
// }) 

// const server = http.createServer((req, res) => {
//     res.statusCode = 200
//     res.setHeader('Content-Type', 'applocation/json')
//     res.write(JSON.stringify({
//         status: "success",
//         data:{
//             message: hello,
//             time: moment().calendar()
//         }
//     }))
//     res.end()
// }) 

// const server = http.createServer((req, res) => {
//      const url = req.url
//      res.statusCode = 200
//      res.setHeader('Content-Type', 'applocation/json')
//      switch (url) {
//         case "/pecel":
//             res.write("nasi pecel")
//             break
//         case "/soto":
//             res.write("soto lamongan")
//             break
//         case "/ayam":
//             res.write("ayam goreng")
//             break
//         case "/bebek":
//             res.write("bebek goreng")
//             break
//         case "/singa":
//             res.write("singa goreng")
//             break
//         case "/gudeg":
//             res.write("gudeg jogja")
//             break
//         default:}
//     res.end()
// })


const server = http.createServer((req, res) => {
     const url = req.url
     res.statusCode = 200
     res.setHeader('Content-Type', 'applocation/json')
    if(url === "/xena"){
    res.end(JSON.stringify({
      name: "Muh Xena",
      alasan: "temen gw"
        }))
    }
    else if(url === "/kahfi"){
    res.end(JSON.stringify({
      name: "Kahfi zikri",
      alasan: "saya sendiri"
        }))
    }
    else if(url === "/pecel"){
    res.end(JSON.stringify({
      name: "Nasi pecel",
      alasan: "kesukaan xena"
        }))    }
    else if(url === "/soto"){
    res.end(JSON.stringify({
      name: "soto bogor",
      alasan: "makanan khas bogor"
        }))
    }
    else if(url === "/ayam"){
    res.end(JSON.stringify({
      name: "ayam goreng",
      alasan: "enaknyo"
        }))
    }
    else if(url === "/bebek"){
    res.end(JSON.stringify({
      name: "bebek goreng",
      alasan: "temen nya ayam"
        }))
    }
    else if(url === "/ikan"){
    res.end(JSON.stringify({
      name: "ikan goreng",
      alasan: "enak kalo pake kecap"
        }))
    }
   else if(url === "/sop"){
    res.end(JSON.stringify({
      name: "sayur lodeh",
      alasan: "tumbuhan yg hidup di air"
        }))
    }
    res.end()
})

const hostname = '127.0.0.1'
const port = 3000
server.listen(port, hostname, () => {
    console.log(`Server running at ${hostname}:${port}`)
})