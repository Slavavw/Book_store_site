/*const React = require("react");
const ReactDOM = require("react-dom");*/
import React from "react";
import ReactDOM from "react-dom";
import "/css/style.css";

const {
  Router,
  Route,
  Link,
  IndexRoute,
  browserHistory
} = require("react-router");
const Modal = require("./modal.jsx");
const Cart = require("./cart.jsx");
const Checkout = require("./checkout.jsx");
const Product = require("./product.jsx");
const VisitCart = require("./visitCart.jsx");
const VideoPreview = require("./videoPreview.jsx");
const Map = require("./map.jsx");
const { ResultCanvas: Canvas } = require("./canvas.jsx");
const AnimationCircle = require("./animationCircle.jsx");
const ClearCookie = require("./clearCookie.jsx");
const LibraryPicture = require("./libraryPicture.jsx");
const DraggableElement = require("./draggableElement.jsx");
const ChatWhithWebSocket = require("./chatWebSocket.jsx");

const Heading = () => {
  return (<header className="well">
    <h1>Book store <code>JS Front-End developer</code></h1>
  </header>)
}
const Copy = () => {
  return (<p>Please click on a book to view details in a modal.<br />
    You can copy/paste the link of the modal. The link will open the book on a separate page.</p>)
};

// главный компонент, потому что он является точкой входа для Webpack 
class App extends React.Component {
  componentWillReceiveProps(newProps) {
    this.isModal = (newProps.location.state && newProps.location.state.modal);
    if (this.isModal && newProps.location.key !== this.props.location.key) {
      this.previousChildren = this.props.children;
    }
  }
  render() {
    return (
      <div className="well">
        <Heading />
        <nav className="nav nav-open">
          <Link to="/" className="btn btn-danger">Home</Link>
          <Link to="/cart" className="btn btn-primary">Cart</Link>
          <Link to="/visit" className="btn btn-primary">Visit doctor</Link>
          <Link to="/video" className="btn btn-primary">Video</Link>
          <Link to="/map" className="btn btn-primary">Map</Link>
          <Link to="/canvas" className="btn btn-primary">Canvas</Link>
          <Link to="/animation" className="btn btn-primary">Animation</Link>
          <Link to="/animation_img" className="btn btn-primary">Picture/Example worker</Link>
          <Link to="/clear_cookie" className="btn btn-primary">Очистка cookie</Link>
          <Link to="/draggable" className="btn btn-primary">Перетаскивание элемента</Link>
          <Link to="/chat" className="btn btn-primary">Чат бот</Link>
        </nav>
        <div>
          {this.isModal ? this.previousChildren : this.props.children}
          {this.isModal ?
            <Modal isOpen={true} returnTo={this.props.location.state.returnTo}>
              {this.props.children}
            </Modal>
            : null
          }
        </div>
      </div>
    )
  }
}

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = { PRODUCT: [] }
  }
  componentWillMount() {
    fetch(`${location.origin}/books`)
      .then(response => response.json())
      .then(data =>
        this.setState({ PRODUCT: [...data] })
      );
  }
  render() {
    let { PRODUCT } = this.state;
    return (
      <div>
        <Copy />
        <div>
          {PRODUCT.map((picture, index) => (
            <Link key={picture.id}
              to={{
                pathname: `/products/${picture.id}`,
                state: { modal: true, returnTo: this.props.location.pathname }
              }}>
              <img src={picture.src} height="100" style={{ margin: 10 }} />
            </Link>
          ))}
        </div>
      </div>
    )
  }
}

let cartItems = {}; //!Объект cartItems содержит текущие позиции покупательской корзины. В исходном состоянии он пуст
const addToCart = (id) => {
  if (cartItems[id]) cartItems[id] += 1
  else cartItems[id] = 1
}

ReactDOM.render(<Router history={browserHistory}>
  <Route path="/" component={App}>
    <IndexRoute component={Index} />
    <Route path="/products/:id" component={Product}
      addToCart={addToCart} product={PRODUCT}
    />
    <Route path="/cart" component={Cart}
      cartItems={cartItems} product={PRODUCT}
    />
    <Route path="/visit" component={VisitCart} />
    <Route path="/video" component={VideoPreview} />
    <Route path="/map" component={Map} />
    <Route path="/canvas" component={Canvas} />
    <Route path="/animation" component={AnimationCircle} color="#11ff45" width={500} height={500} radius={40} />
    <Route path="/clear_cookie" component={ClearCookie} />
    <Route path="/draggable" component={DraggableElement} />
    <Route path="/chat" component={ChatWhithWebSocket} />
  </Route>
  <Route path="/checkout" component={Checkout}
    cartItems={cartItems} product={PRODUCT}
  />
  <Route path="/animation_img" component={LibraryPicture} />
</Router>,
  document.getElementById("content")
);