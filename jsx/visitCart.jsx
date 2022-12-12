const React = require("react");
const ReactDOM = require("react-dom");
const fndDOM = ReactDOM.findDOMNode;
const { FaArrowAltCircleRight, FaPause, FaStop } = require("react-icons/fa");
const VideoPreview = require("./videoPreview.jsx")

const generateColor = () => {
  let color = [255, 255, 255, 1].map((el, index) => index === 3 ? Math.random() * el : Math.floor(Math.random() * el));
  return `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`
}

class VisitCart extends React.Component {
  constructor(props) {
    super(props);
    this.showDateFields = this.showDateFields.bind(this);
    this.state = {
      bob: VisitCart.prepeareDate(new Date()),
      showDialog: false
    };
  }
  componentDidMount() {
    //    $(ReactDOM.findDOMNode(this)).find("audio")[0].play();
  }
  showDateFields(event) {
    event.preventDefault();
    $(event.target).datepicker({
      onSelect: (dateText, inpt) => {
        console.log(dateText);
        if (new Date().toLocaleDateString() !== new Date(dateText).toLocaleDateString()) {
          this.setState({ showDialog: true }, () => {
            $("#dialogForm").dialog({
              modal: true,
              buttons: [{
                text: "Ok",
                icon: "ui-icon-close",
                click: function () {
                  $(this).dialog("close");
                }
              }]
            })
          })
        }
        else this.setState({ bob: VisitCart.prepeareDate(new Date(dateText)), showDialog: false });
      },
      onClose: (evnt) => {
        $("#dialog *").remove();
        $("#dialog").dialog("close");
      },
      monthNames: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
      dayNamesMin: ["пн", "вт", "ср", "чт", "птн", "сб", "вс"]
    });
  }
  static prepeareDate(data) {
    return data.toLocaleDateString().split(".").reverse().join("-")
  }
  render() {
    return <div>
      <h1>Расписание приема</h1>
      <form>
        {this.state.showDialog ? <div id="dialogForm" title="Wrong data">
          <p>
            <span className="ui-icon ui-icon-circle-check" style={{ "float": "left", "margin": "0 7px 50px 0" }}></span>
            Дата выбора не совпадает с текущей датой
          </p>
        </div> : null}
        <fieldset>
          <legend>Личная информация</legend>
          <p><label>Имя <input type="text" name="name" required /></label></p>
          <p><label>Телефон <input type="tel" name="phone" required pattern="[2-9][0-9]{2}-[0-9]{3}" title="Северо-американский формат ХХХ-ХХХ" /></label></p>
          <p><label>Адрес электронной почты <input type={"email"} name="email" /></label></p>
          <p><label>Дата рождения
            <input type={"date"} name="dob"
              onClick={this.showDateFields}
              value={this.state.bob}
            /></label></p>
        </fieldset>
        <fieldset>
          <legend>Назначен прием</legend>
          <p><label htmlFor="reason">Какова причина вашего визита?</label></p>
          <datalist id="reasons">
            <select name="reason">
              <option>Плановый осмотр</option>
              <option>Симптомы простуды или гриппа</option>
              <option>Анализ крови</option>
              <option>Другое</option>
            </select>
          </datalist>
          <p><input id="reason" name="reason" list="reasons" /></p>
          <p><label>Степень болевых ощущений
            <input type={"range"} name="pain" min="0" max=".5" step="2" defaultValue="5"
              title="0 нет болиб 10 больнестерпимая"
            />
          </label></p>
          <p><label>Предпочтительная дата <input type={"date"} name="date" required min={new Date(new Date() + 360).toLocaleDateString()} max={new Date().getDate()} /></label></p>
        </fieldset>
        <Audio ref="visitAudio" />
        <button className="btn btn-primary" type="submit">Отправить</button>
      </form>
      <VideoPreview />
    </div>
  }
}

class Audio extends React.Component {
  constructor(props) {
    super(props);
    this.interval;
    this.state = { duration: "00:00:00", currentTime: "00:00:00", amountLoaded: "0px" };
    this.point = { x: 0, y: 0 };
  }
  componentDidMount() {
    var audio = fndDOM(this.refs.audio);
    let ar = ["audio/mp3", "audio/ogg"].find(el => (source.canPlayType(el)), source = audio);
    audio.play();
    this.interval = setInterval(() => {
      audio.pause();
      audio.currentTime = 0;

      this.point.x = 0;
      let canvas = fndDOM(this.refs.canvas);
      let context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);

      audio.play();
    }, 21 * 1000);
  }
  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }
  render() {
    return <div id="player">
      <audio ref="audio" preload="metadata"
        onLoadedMetadata={(event) => {
          let audio = event.target;
          this.setState({
            duration: audio.duration
          }, () => { let context = fndDOM(this.refs.canvas).getContext("2d"); context.moveTo(0, 0); })
        }}
        onTimeUpdate={(event) => {
          let audio = event.target;
          let canvas = fndDOM(this.refs.canvas);
          let context = canvas.getContext("2d");
          context.beginPath();
          this.setState({
            currentTime: audio.currentTime,
            amountLoaded: (audio.currentTime / audio.duration) * 200 + "px"
          }, () => {
            context.fillStyle = generateColor();
            context.fillRect(this.point.x, this.point.y, canvas.width / 21, 25);
            this.point.x = this.point.x + canvas.width / 21;
          });
        }}
      >
        <source src={this.props.src} />
      </audio>
      <div className="playerControls">
        <button id="audioPlay" title="Play" className="btn btn-link"
          onClick={() => {
            let audio = fndDOM(this.refs.audio);
            audio.play()
          }}><FaArrowAltCircleRight /></button>
        <button id="audioPause" title="Pause" className="btn btn-link"
          onClick={() => {
            let audio = fndDOM(this.refs.audio);
            audio.pause()
          }}><FaPause /></button>
        <button id="audioStop" title="Stop audio" className="btn btn-link"
          onClick={(event) => {
            let audio = fndDOM(this.refs.audio);
            audio.currentTime = 0; audio.pause();
          }}><FaStop /></button>
        <div id="audioSeek">
          <div id="audioLoaded"
            style={{
              "width": `${this.state.amountLoaded}`,
              "backgroundColor": "#0000ff", "height": "20px"
            }}
          />
        </div>
        <ul id="audioTimes">
          <li id="audioElapsed">{this.state.currentTime}</li>
          <li id="audioDuration">{this.state.duration}</li>
        </ul>
      </div>
      <canvas ref="canvas" id="canvas-visit" width={"500px"} height={"50px"}></canvas>
    </div >
  }
}

Audio.defaultProps = {
  src: '/audio/sumna.mp3'
}

module.exports = VisitCart;