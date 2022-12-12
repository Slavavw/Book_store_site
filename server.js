const colors = require('colors');
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const mime = require("mime");
//todo используем websocket для вебсокет соединения веб чат
const webSocket = require("websocket");
//todo перезаписали в папку dist файлы с папок audio, image, css, audio
require("./server_folder/copyFolder.js");
const bodyJson = require("body-parser");
//todo подключаем компиляцию на ходу из JSX в JS React
//todo для импортирования JSX после установки babel-register и babel-preset-react из npm:
require('@babel/register')({ presets: ['@babel/env', '@babel/react'] });
const cb = err => { throw err; }
const React = require("react"); const ReactDOMServer = require("react-dom/server");
const AnimationOnImage = require("./jsx/animationImage.jsx");
const renderToString = ReactDOMServer.renderToString(React.createElement(AnimationOnImage));
//console.log(renderToString);
//создали для рендеринга на стороне сервера React element
const ErrorBundle = React.createElement(
  require("./jsx/errorBundle.jsx"),
  { width: "200px", height: "100px" },
  React.createElement(
    require("./jsx/animationCircle.jsx"),
    {
      width: "500px", height: "100px",
      style: { position: "absolute", left: 50, "zIndex": "-10000" },
      speed: "1000 / 24"
    }, null
  )
);

const PORT = process.env.PORT || 500;
const hostname = "localhost" || "127.0.0.1";
const book_store = require("./book_store.json");
const { compose, replaceReservedSymbol, replaceRushienLetter } = require("./server_folder/correct_path.js");

const generateColor = require("./js/generaterColor.js")();
const usersProperty = new Map();
const clients = [];
const historyChat = [];

let server = new http.Server();
server.listen(PORT, hostname, () => console.log(`Сервер запущен по адреcу: http://${hostname}:${PORT}`.bgBrightGreen));

let path_chatbot = path.join(__dirname, "chatHistory", "chatHistory.txt");

//?Читаем из файла архив чата
/*function readChatfiles(pathToChat) {
  fs.readFile(pathToChat, "utf8", (err, data) => {
    if (err) return cb(err);
    let reg = /(\[date\](?<date>([a-z0-9]+|\s*|:*|\.*|,*)+))(\[user\](?<user>(\w|\s|[\u0400-\u04FF])*))(\[message\](?<message>([a-zA-Z0-9\u0400-\u04FF]*|\s*|\S*)+))\[end\]/gi;
    let messages = Buffer.from(data).toLocaleString();
    let match;
    while ((match = reg.exec(messages)) !== null) {
      let o = Object.assign({}, match.groups);
      if (!usersProperty.has(o.user)) {
        let color = generateColor();
        console.log(`======================${color}============`.bgCyan);
        usersProperty.set(o.user, color);
      }
      o.color = usersProperty.get(o.user);
      console.log(`+++++++++++++++${decomposeObject(o)}============`.bgCyan);
      historyChat.push(o);
    }
  })
}
*/
(function (pathToChat = "./chatHistory/chatHistory.txt") {
  fs.readFile(pathToChat, "utf8", (err, data) => {
    if (err) return cb(err);
    let reg = /\[end\]/gi;
    let messages = Buffer.from(data).toLocaleString();
    let match, index = -"[end]".length;
    while ((match = reg.exec(messages)) !== null) {
      let o = {};
      let cutWords = messages.substring(index + 5, match.index)
        .split(/(\[date\])|(\[user\])|(\[message\])/)
        .filter(el => el)
        .filter((el, index) => index % 2);
      ["date", "user", "message"].forEach((val, index) => o[`${val}`] = cutWords[index]);
      if (!usersProperty.has(o.user)) {
        let color = generateColor();
        console.log(`======================${color}============`.bgCyan);
        usersProperty.set(o.user, color);
      }
      o.color = usersProperty.get(o.user);
      console.log(`+++++++++++++++${decomposeObject(o)}============`.bgCyan);
      historyChat.push(o);
      index = match.index;
    }
  })
})(path_chatbot)

//?Записываем чат в архив
function writeChatbot(pathToChat) {
  let writeStream = fs.createWriteStream(pathToChat, "utf8");
  writeStream.write(
    historyChat.map(stream => `[date]${stream['date']}[user]${stream['user']}[message]${stream['message']}[end]`)
      .join(""),
    () => {
      console.log(historyChat.map(stream => `[date]${stream['date']}[user]${stream['user']}[message]${stream['message']}[end]`)
        .join("").bgBrightGreen);
    }
  )
}

server.on("request", (request, response) => {
  let pathname = url.parse(request.url).pathname;
  if (request.method === "GET") {
    let filePath = path.join(__dirname, compose(request.url)(replaceRushienLetter, replaceReservedSymbol));
    if (pathname === "/") {
      const streamRead = fs.createReadStream(path.join(__dirname, "dist", "index.html"));
      var dataBuffer = [];
      streamRead.on("data", chunk => {
        dataBuffer = dataBuffer.concat(...chunk);
      });
      streamRead.on("error", err => {
        let result = Buffer.from(dataBuffer)
          .toString()
          .replace(/\<body\>.{1,}\<\/body\>/s, `<body>          
          <div id='content'></div>
          <script>
          ReactDOM.render(${ReactDOMServer.renderToString(ErrorBundle)},document.getElementById("content"));
          </script>          
          </body>`);
        if (err.code === "ENOENT") {
          response.writeHead(404, { "content-type": "text/html; chatset=utf-8" });
          response.end(result);
        }
        else {
          response.statusCode = 500;
          response.end(result);
        }
        console.log(err);
      });
      streamRead.on("end", () => {
        response.writeHead(200, { "content-type": "text/html; chatset=utf-8" });
        let result = Buffer.from(dataBuffer)
          .toString()
          .replace(/<body>/i, `<body><script>const PRODUCT = ${JSON.stringify(book_store)}</script>`);
        console.log(result.bgMagenta);
        response.write(result);
        //response.write();
        response.end();
      })
    }
    else if (pathname === "/books") {
      response.writeHead(200,
        { "Content-Type": "application/json" }
      ).end(JSON.stringify(book_store));
    }
    else if (pathname === "/animation_img/library") {
      let pathLibreryPict = path.join(__dirname, "dist", "images", "library");
      let res = [];
      fs.readdir(pathLibreryPict, (err, files) => {
        if (err) cb(err);
        for (let file of files) {
          res.push(path.join("dist", "images", "library", file));
        }
        console.log(res.join("\n\t").america);
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(res));
      })
    }
    else {
      console.log(filePath.red);
      fs.exists(filePath, (ext) => {
        if (ext) {
          let readStream = fs.createReadStream(filePath);
          var dataBuffer = [];
          response.writeHead(200, {
            "content-type": mime.getType(path.basename(filePath))
          });
          //      readStream.pipe(response);
          readStream.on("data", (chunk) => {
            dataBuffer = [...dataBuffer, chunk];
            response.write(chunk);
          });
          readStream.on("end", () => response.end())
        }
        else {
          console.error("mistake:", filePath.bgRed);
          response.end();
        }
      })
    }
  }
})

server.on("close", () => {
  console.log("===================close server listerner=================\t\n".america);
})

//todo: Сервер webSocket привязан к HTTP-серверу. Запрос webSocket - это просто расширенный HTTP-запрос.
const wsServer = new webSocket.server({ httpServer: server });
//todo реакция нашего сервера web-сокетов на попытку подключения очередного участника чата:
wsServer.on("request", (request) => {
  let urlsocket = new url.URLSearchParams(request.resource.replace("/?", ""));
  if (!urlsocket.has("user") || !urlsocket.get("user").length) {
    request.reject(400, "wrong url");
    return null;
  }
  console.log((new Date() + "Соединение от " + request.origin).bgYellow);
  //? Проверяем, что клиент подключается с нашего сайта
  var connection = request.accept("ws", request.origin);
  //? сохраняем это соединение и запоминаем его индекс в массиве, чтобы удалить при отключении клиента (событие "close")
  clients.push(connection);
  console.log("hfpvt", historyChat.length);
  if (historyChat.length) {
    console.log("отсылаем истоию чата".bgYellow);
    connection.sendUTF(JSON.stringify({
      type: "history",
      messages: historyChat
    }))
  }
  connection.on("message", (message) => {
    console.log("clients.length", clients.length.bgRed);
    if (message.type === "utf8") {
      let data = JSON.parse(message.utf8Data);
      if (data.type && data.type === "delete") {
        console.log("data.item", data.item);
        historyChat.splice(+data.item, 1);
        for (let client of clients) {
          client.sendUTF(JSON.stringify({
            type: "history",
            messages: historyChat
          }))
        }
      }
      else {
        if (!usersProperty.has(data.user)) {
          let color = generateColor();
          console.log(`======================${color}============`.bgCyan);
          usersProperty.set(data.user, color);
        }
        data.color = usersProperty.get(data.user);
        historyChat.push(data);
        decomposeObject(historyChat[historyChat.length - 1], "user message");
        for (let client of clients) {
          console.log("send new message to");
          client.sendUTF(JSON.stringify({
            type: "message",
            message: historyChat[historyChat.length - 1]
          }))
        }
      }
      writeChatbot(path_chatbot);
    }
  })
  connection.on("close", (connection) => {
    console.log((new Date() + " Клиент " + connection + " отключен").bgMagenta);
    console.log(clients.length);
    console.log(this);
    decomposeObject(connection);
    clients.splice(clients.indexOf(connection), 1);
  })
})

function decomposeObject(obj, name = "") {
  let o = Object.assign({}, obj);
  console.log(`===========имя объекта: ${name}============`.underline.bgMagenta);
  for (let [key, value] of Object.entries(o)) {
    console.log(`key: ${key}`.bgCyan, ` value: ${value}`.italic.bgMagenta);
  }
}