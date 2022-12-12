const React = require("react");
const { Link } = require("react-router");

class Checkout extends React.Component {
  render() {
    let count = 0, keys = Object.keys(this.props.route.cartItems);
    return (
      <div><h1>Invoice</h1>
        <table className="table table-bordered">
          <tbody>
            {keys.map((key, index) => {
              count += this.props.route.cartItems[key];
              return <tr key={key}>
                <td>{this.props.route.product[index].title}</td>
                <td>{this.props.route.cartItems[key]}</td>
              </tr>
            })}
          </tbody>
        </table>
        <p>Total: {count}</p>
      </div>
    )
  }
}

module.exports = Checkout;