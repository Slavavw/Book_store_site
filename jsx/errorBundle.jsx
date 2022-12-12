const React = require("react");
const { gradientColor } = require("./reducerDrawFunction.jsx");

class ErrorBundle extends React.Component {
  componentDidMount() {
    let context = $('.error-canvas')[0].getContext("2d");
    let message = "No connection..";
    let fontSize = 30;
    context.font = `${fontSize}px Arial`;
    context.textAlign = "center"; context.textBaseline = "middle";
    while (context.measureText(`${message}`).width > this.props.width) {
      fontSize--;
      context.font = `${fontSize}px Arial`;
    }
    context.strokeText(`${message}`, 100, 20);
    context.fillStyle = gradientColor(1, null, context)(0, 0, this.props.width);
    context.fillText(`${message}`, 100, 20);
  }
  render() {
    let { width, height } = this.props;
    return <article>
      <canvas
        className="error-canvas"
        width={width} height={height}>
      </canvas>
      {this.props.children}
    </article>
  }
}

module.exports = ErrorBundle;