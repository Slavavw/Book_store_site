//require("babel-register")({ presets: ["react"] }); //!подключаем компиляцию на ходу из JSX в JS React
require('@babel/register')({ presets: ['@babel/env', '@babel/react'] }); //!для импортирования JSX после установки babel-register и babel-preset-react из npm:

const http = require("http");
const fs = require("fs");
const path = require("path");

const React = require("react");
const { renderToString } = require("react-dom/server");
const LibraryPicture = require("./jsx/libraryPicture");

const mime = require("mime");
const express = require("express");
const app = express();
const bodyParser = require("body-parser"); //!body-parser — обеспечивает автоматический разбор 
//!JSON и формата данных в объектах Node/JS, доступных в request.body.
const WebSocket = require("websocket");
const { json } = require('body-parser');
const hostname = "127.0.0.1";
const PORT = "500";

/*const copyFolder = require("./server_folder/copyFolder.js");
copyFolder();*/
let library = [];
app.use(bodyParser.json()); //!Обеспечивает разбор входных данных в формате JSON
app.use(express.static(path.join(__dirname, "dist")));
app.use((req, res, next) => {
  console.log(req.url);
  const pathToFolder = path.join(__dirname, "dist", "images", "library");
  console.log(req.url);
  fs.readdir(pathToFolder, (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach(file => {
        library.push(path.join(pathToFolder, file));
      })
    }
    res.send("<div style='color:red; width:200px; font-size:20em;'>хуй</div>");
    console.log(library.toString());
    next();
  })
})
app.get("/product", (req, res) => {
  console.log("**********************жопа***********************");
  console.log("**********************жопа***********************", req.url);
  console.log(getLibrary());
  console.log(JSON.stringify(getLibrary()));
  res.setHeader('Content-Type', 'application/json');
  return res.json(getLibrary());
  //res.send("<div style='color:red; width:200px; font-size:20em;'>хуй</div>")
})

const getLibrary = () => [
  {
    "id": "0",
    "src": "./dist/images/proexpress-cover.jpg",
    "title": "Pro Express.js",
    "url": "http://amzn.to/1D6qiqk"
  },
  {
    "id": "1",
    "src": "./dist/images/practicalnode-cover.jpeg",
    "title": "Practical Node.js",
    "url": "http://amzn.to/NuQ0fM"
  },
  {
    "id": "2",
    "src": "./dist/images/expressapiref-cover.jpg",
    "title": "Express API Reference",
    "url": "http: //amzn.to/1xcHanf"
  },
  {
    "id": "3",
    "src": "./dist/images/reactquickly-cover.jpg",
    "title": "React Quickly",
    "url": "https: //www.manning.com/books/react-quickly"
  },
  {
    "id": "4",
    "src": "./dist/images/fullstack-cover.png",
    "title": "Full Stack JavaScript",
    "url": "http: //www.apress.com/9781484217504"
  }
]


app.get("/animation_img", (req, res, next) => {

  console.log("жопеда!!!!!");
  res.send("<div style='color:red; width:200px; font-size:20em;'>хуй</div>")

})

const server = http.createServer(app);
server.listen(PORT, hostname, () => console.log(`Сервер запущен по адреcу: http://${hostname}:${PORT}`));


/*
const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  console.log(req.url);
  let mime_type = mime.getType(req.url);
  console.log("mime_type:", mime_type);

  const streamRead = fs.createReadStream(filePath);
  var dataBuffer = [];
  streamRead.on("data", chunk => {
    dataBuffer = dataBuffer.concat(...chunk);
  });
  streamRead.on("error", err => {
    if (err.code === "ENOENT") {
      res.writeHead(404, {
        "content-type": "text/html; chatset=utf-8"
      });
      res.end("Not Found");
    }
    else {
      res.statusCode = 500;
      res.end("Internet Server Error");
    }
    console.log(err);
  });
  streamRead.on("end", () => {
    res.writeHead(200, { "content-type": mime_type });
    //console.log(Buffer.from(dataBuffer).toString());
    res.write(Buffer.from(dataBuffer));
    res.end();
  })
  return next()
*/

/*app.get("*", (req, res, next) => {
  console.log("жопкеда!!!!!");
  const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  let mime_type = mime.getType(req.url);
  console.log("mime_type ", mime_type);
  console.log("file: ", filePath);
  const streamRead = fs.createReadStream(filePath);
  var dataBuffer = [];
  streamRead.on("data", chunk => {
    dataBuffer = dataBuffer.concat(...chunk);
  });
  streamRead.on("end", () => {
    res.writeHead(200, { "content-type": mime_type });
    //console.log(Buffer.from(dataBuffer).toString());
    res.end(Buffer.from(dataBuffer));
  });
  return next()
})*/
