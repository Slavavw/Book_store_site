const React = require("react");
const { Link } = require("react-router");

class Cart extends React.Component {
  render() {
    var keys = Object.keys(this.props.route.cartItems);
    return (
      <div>
        {!keys.length ? <p>You cart is empt</p> : ''}
        <ul>
          {keys.map((key, index, list) => (
            <li key={key}>
              {this.props.route.product[index].title} - {this.props.route.cartItems[key]}
            </li>)
          )}
        </ul>
        <Link to='/checkout' className="btn btn-primary">Checkout</Link>
        <Link to='/' className="btn btn-info">Home</Link>
      </div>
    )
  }
}

module.exports = Cart;