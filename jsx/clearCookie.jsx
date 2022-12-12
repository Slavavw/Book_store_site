const React = require("react");
const { FaHandPointDown, FaTrash } = require("react-icons/fa");
const { findDOMNode } = require("react-dom");

/*
class ClearCookie extends React.Component {
  constructor() {
    super();
    this.cookie = [];
    this.state = { redraw: false };
    this.readLocalStorage = this.readLocalStorage.bind(this);
    this.click = false;
  }
  readLocalStorage() {
    this.cookie = [];
    let key, data;
    for (let i = 0; i < localStorage.length; i++) {
      key = localStorage.key(i);
      data = localStorage.getItem(key);
      this.cookie.push({ key, data });
    }
  }
  fadeInOut() {
    let detalis = findDOMNode(this.refs["popup_cookie"]);
    this.click = !this.click;
    if (this.click) $(detalis).find(":not(:first-child)").fadeIn(1000);
    else $(detalis).find(":not(:first-child)").fadeOut(1000);
  }
  componentWillMount() { this.readLocalStorage(); }
  shouldComponentUpdate(newProps, newState) { this.readLocalStorage(); return true; }
  render() {
    return (<details onClick={this.fadeInOut.bind(this)} ref="popup_cookie"
      style={{ "backgroundColor": "rgba(100,50,60,.4)", "cursor": "pointer" }}>
      <summary><FaHandPointDown color="gray" size={25} />Сохраненные Cookie нажми чтобы развернуть список</summary>
      <aside title="список в прямом порядке с заданием начала с 4">
        <h3>список в прямом порядке с заданием начала с 1</h3>
        <ol start="1">
          {this.cookie.map((cookie, i) => {
            return <li key={i + 1}>key:{cookie.key} <ul><li>data: {cookie.data}</li></ul> </li>
          })}
        </ol>
      </aside>
      <button className="btn btn-info"
        onClick={(event) => {
          this.cookie.map(cookie => {
            let { ts } = JSON.parse(cookie.data);
            if (new Date(ts) > new Date(new Date() - 15 * 60 * 60 * 24 * 1000))
              localStorage.removeItem(cookie.key)
          })
          this.setState({ redraw: !this.state.redraw })
        }}
      ><FaTrash /> Clear</button>
    </details>
    )
  }
}
*/


class ClearCookie extends React.Component {
  constructor() {
    super();
    this.cookie = [];
    this.state = { redraw: false };
    this.readLocalStorage = this.readLocalStorage.bind(this);
    this.click = false;
  }
  readLocalStorage() {
    this.cookie = [];
    let key, data;
    for (let i = 0; i < localStorage.length; i++) {
      key = localStorage.key(i);
      data = localStorage.getItem(key);
      this.cookie.push({ key, data });
    }
  }
  fadeInOut() {
    let detalis = findDOMNode(this.refs["popup_cookie"]);
    this.click = !this.click;
    if (this.click) $(detalis).find(":not(:first-child)").fadeIn(1000, "linear");
    else $(detalis).find(":not(:first-child)").fadeOut(1000, "linear");
  }
  componentWillMount() { this.readLocalStorage(); }
  shouldComponentUpdate(newProps, newState) { this.readLocalStorage(); return true; }
  render() {
    return (<article onClick={this.fadeInOut.bind(this)} ref="popup_cookie"
      style={{ margin: "25px 10px", "cursor": "pointer" }}>
      <FaHandPointDown color="gray" size={25} />Сохраненные Cookie нажми чтобы развернуть список
      <aside title="список cookir ">
        <ol start="1">
          {this.cookie.map((cookie, i) => {
            return <li key={i + 1}>key:{cookie.key} <ul><li>data: {cookie.data}</li></ul> </li>
          })}
        </ol>
      </aside>
      <button className="btn btn-info"
        onClick={(event) => {
          this.cookie.map(cookie => {
            //  localStorage.removeItem(cookie.key);
            let { ts } = JSON.parse(cookie.data);
            //  if (new Date(ts) > new Date(new Date() - 15 * 60 * 60 * 24 * 1000))
            localStorage.removeItem(cookie.key)
          })
          this.setState({ redraw: !this.state.redraw })
        }}
      ><FaTrash /> Clear</button>
    </article>
    )
  }
}

module.exports = ClearCookie;
