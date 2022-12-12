const React = require("react");
const { Link } = require("react-router");

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.handleBuy = this.handleBuy.bind(this);
  }
  handleBuy(event) {
    this.props.route.addToCart(this.props.params.id)
  }
  render() {
    let { src, title, id } = this.props.route.product[this.props.params.id];
    return (
      <div style={{ width: "100%", height: "90%" }}>
        <img src={src} style={{ height: "70%" }} />
        <p>{title}</p>
        <Link to={{
          pathname: "/cart",
          state: { productId: id }
        }}
          onClick={this.handleBuy} className="btn btn-primary"
        >
          Buy
        </Link>
      </div>
    )
  }
}

module.exports = Product;