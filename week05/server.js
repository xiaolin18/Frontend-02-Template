const http = require("./client");

//创建服务
http.createServer((req,res)=>{
  let body = [];
  req.on("error", error => {
    console.error(error);
  }).on("data", chunk => {
    body.push(chunk.toString());
  }).on("end", () => {
    body = Buffer.concat(body).toString();
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Hello world !");
  })
}).listen(8080);
console.log('runing......')