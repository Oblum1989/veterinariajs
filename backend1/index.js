const http = require('http');
const requestHandler = require("./request_handler");
const server = http.createServer(requestHandler)

server.listen(6000, ()=>{
  console.log('el servidor ha sido montado')
});