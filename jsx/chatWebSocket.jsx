const React = require("react");
const { findDOMNode } = require("react-dom");
const AnimationCircle = require("./animationCircle.jsx");
const ErrorBundle = require("./errorBundle.jsx");
const { FaExpandArrowsAlt } = require("react-icons/fa");
//const AdImgeChatBot = require("./addImage.jsx");
const ButtonFileInput = require("./buttonFileInput.jsx");

class ChatWhithWebSocket extends React.Component {
  constructor(props) {
    super(props);
    this.connection = null;
    this.state = {
      messages: [],
      error: false,
      message: "",
      user: sessionStorage.getItem("user") || ""
    }
    this.postMessage = this.postMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.createWebSocketTemplate = this.createWebSocketTemplate.bind(this);
    this.value = "";
  }

  createWebSocketTemplate(user) {
    let urlsocket = new URL(location.origin);
    urlsocket.searchParams.set("user", user);
    urlsocket.protocol = "ws";
    this.connection = new WebSocket(urlsocket, "ws");
    if (this.connection) {
      this.connection.addEventListener("message", this.postMessage);
      this.connection.addEventListener("error", () => this.setState({ error: true }));
    }
  }

  componentWillMount() { this.createWebSocketTemplate(this.state.user); }

  postMessage(msg) {
    let { type, messages, message } = JSON.parse(msg.data);
    switch (type) {
      case "history":
        this.setState({ messages, error: false });
        break;
      case "message":
        this.setState({ messages: [...this.state.messages, message] });
        break;
      default:
        this.setState({ error: true })
    }
  }

  setStateValue(name, value) { this.setState({ [`${name}`]: value }) }

  sendMessage(event) {
    this.connection.send(JSON.stringify({
      date: (new Date()).toLocaleString("ru"),
      user: this.state.user,
      message: this.state.message
    }));
    this.setState({ message: "" });
  }

  deleteMessage(item) {
    console.log("item", item);
    this.connection.send(JSON.stringify({
      type: "delete",
      item
    }))
  }

  componentWillUnmount() {
    if (this.connection) {
      this.connection.removeEventListener("message", this.postMessage);
      this.connection.removeEventListener("error", () => this.setState({ error: true }));
      this.connection.close();
    }
  }

  componentWillUpdate(newProp, newState) {
    if (newState.user !== this.state.user) this.createWebSocketTemplate(newState.user)
  }

  setUser(newUser) { this.setState({ user: newUser }) }

  render() {
    if (!this.connection) return null;
    if (this.state.error) {
      return <ErrorBundle width={200} height={100}>
        <AnimationCircle width={500} height={100} style={{ position: "absolute", left: 50, "zIndex": "-10000" }} speed={1000 / 24} />
        <UserWnd setUser={this.setUser.bind(this)} />
      </ErrorBundle>
    }
    return <div className="chatlog well">
      <article className="all-browser">
        <h3>Chat-bot</h3>
        {this.state.messages.map((msg, index) => <MessageElement key={index + 1} index={index + 1} msg={msg} deleteMessage={this.deleteMessage} />)}
      </article>
      <span>{this.props.name}</span>
      <Message setStateValue={this.setStateValue.bind(this)} sendMessage={this.sendMessage.bind(this)} message={this.state.message} />
    </div>
  }
}

class MessageElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = { display: false };
    this.setDisplay = this.setDisplay.bind(this);
  }
  setDisplay(event) {
    event.preventDefault();
    this.setState({ display: !this.state.display })
  }
  render() {
    let { user, date, message, color } = this.props.msg, index = this.props.index;
    return <article
      className="browser" key={index}>
      <span style={{ color }}>{`${user}: ${date}:`}</span>
      <p className="message-field"
        onMouseEnter={this.setDisplay} onMouseLeave={this.setDisplay}
      >{message}
        {<FaExpandArrowsAlt className="delete-message" display={this.state.display ? "inline-block" : "none"}
          onClick={() => this.props.deleteMessage(index - 1)}
        />}
      </p>
    </article>
  }
}

class UserWnd extends React.Component {
  constructor(props) {
    super(props);
    this.styles = {
      visibility: "hidden",
      transition: "all 1000ms cubic-bezier(0.42, 0, 1, 1) 0s"
    }
    this.state = { className: "", user: "", close: false };
  }
  componentDidMount() {
    setTimeout(
      () => {
        this.styles = { ...this.styles, visibility: "visible" };
        this.setState({ className: "user-name-chat-bot" })
      }, 500);
  }
  submit(event) {
    let { user } = this.state;
    event.preventDefault();
    if (!user.length) {
      $("#dialogWnd_generate")
        .append(`<p>Enter user name before submit</p>`)
        .dialog({
          show: { effect: "blind", duration: 800 },
          buttons: [{
            text: "Ok",
            icon: "ui-icon-close",
            click: () => $("#dialogWnd_generate").dialog("close")
          }],
          close: (event, ui) => $("#dialogWnd_generate").text("")
        })
    }
    else {
      sessionStorage.setItem("user", `${user}`);
      this.props.setUser(user);
    }
  }
  render() {
    let { user, close } = this.state;
    return (close ? null : <form className={this.state.className} style={this.styles} action="post"
      onSubmit={this.submit.bind(this)}>
      <fieldset>
        <legend>Enter your name before chating</legend>
        <p>
          <label htmlFor="username">User name
            <input type="text" name="username" placeholder="enter your name before chating..."
              value={user}
              onKeyDown={event => {
                if (event.keyCode === 13 && event.target.value.length) this.submit;
              }}
              onChange={(event) => this.setState({ user: event.target.value })}
            />
          </label>
        </p>
        <input type={"submit"} value="Ok" className="btn chatbot-btn" />
        <input type={"button"} value="Cancel" className="btn chatbot-btn"
          onClick={() => this.setState({ close: !this.state.close })}
        />
      </fieldset>
    </form>
    )
  }
}

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = { "cursor": "pointer" };
    this.loadfile = this.loadfile.bind(this);
    this.img = null;
  }
  loadfile(files) {
    let context = findDOMNode(this.refs['load-image']).getContext("2d");
    Promise.all(Array.of(files).map(fileArrType => new Promise((resolve, reject) => {
      let file = fileArrType[0];
      let reader = new FileReader();
      if (/image/.test(file.type)) {
        reader.readAsDataURL(file);
        //reader.readAsArrayBuffer(file);
      }
      if (reader) { resolve(reader); }
      reader.onerror = (event) => { reject(reader.error.code); }
    })
      .then(reader => {
        reader.onprogress = (event) => {
          //$("#progressbar_generate").progressbar({classes:{"ui-progressbar": "highlight"}})
          let value = event.lengthComputable ? event.loaded / event.total : 0;
        }
        reader.onload = (event) => {
          this.setState({ "zoomin": "zoom-in" }, () => {
            this.img = new Image(); this.img.src = reader.result;
            this.img.onload = (event) => {
              context.drawImage(this.img, 0, 0, context.canvas.width, context.canvas.height);
              async function getCanvasBlob(canvas) {
                return new Promise((resolve, reject) => {
                  canvas.toBlob(resolve);
                });
              }
              async function uploadCanvasImage(canvas) {
                let pngblob = await getCanvasBlob(canvas);
                let formdata = new FormData();
                formdata.set("canvasimage", pngblob);
                let response = await fetch("/load-image", { method: "POST", body: formdata });
                let body = await response.json();
                return body;
              }
              let body = uploadCanvasImage(context.canvas);
              console.log(body)
            }
          })
        }
      })
    ))
  }


  render() {
    let { message, setStateValue, sendMessage } = this.props;
    let [width, height] = [0, 0];
    if (/zoom-in/gi.test(this.state.zoomin)) { width = height = this.props.size }
    else if (/zoom-out/gi.test(this.state.zoomin)) { width = height = this.props.zooming_size }
    return <div className="wrapper-messaage-box">
      <div className="wrapper-messaage-box-foter">
        <textarea rows="3" maxLength="250" placeholder="enter message"
          style={{ flex: 2 }}
          value={message}
          onKeyDown={event => {
            if (event.keyCode === 13 && event.target.value.length) this.sendMessage
          }}
          onChange={(event) => { setStateValue("message", event.target.value) }} />
        <canvas ref="load-image" width={width} height={height} style={{ "cursor": `${this.state.zoomin}`, right: 0, top: 0 }}
          onClick={
            () => this.setState(
              { zoomin: /zoom-in/gi.test(this.state.zoomin) ? "zoom-out" : "zoom-in" },
              () => {
                let context = findDOMNode(this.refs['load-image']).getContext("2d");
                context.drawImage(this.img, 0, 0, context.canvas.width, context.canvas.height);
              })
          }
        />
      </div>
      <ButtonFileInput width="200px" height="40px" accept=".jpg, .jpeg, .png" loadfile={this.loadfile.bind(this)} />
      <button className="btn btn-info" onClick={sendMessage}>Отправить сообщение</button>
    </div>
  }

}

Message.defaultProps = {
  size: 300, zooming_size: 600
}

module.exports = ChatWhithWebSocket;